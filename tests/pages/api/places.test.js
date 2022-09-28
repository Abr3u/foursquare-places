import MockAdapter from "axios-mock-adapter";
import { createMocks } from "node-mocks-http";

// src files
import handler from "../../../src/pages/api/places";
import { getPhotoPath } from "../../../src/utils/functions";
import client from "../../../src/api/clients/foursquare-client";

// mock data
const MOCK_LAT = "38.7082797";
const MOCK_LONG = "-9.3340266";
const MOCK_SEARCH_ENDPOINT = `/places/search?ll=${MOCK_LAT},${MOCK_LONG}`;

import MOCK_PLACES from "../../mocks/foursquare-places-search-response.json";
import MOCK_PHOTOS from "../../mocks/foursquare-place-photos-response.json";

describe("/api/places", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(client);

    mock.onGet(MOCK_SEARCH_ENDPOINT).reply(200, MOCK_PLACES);

    const photosUrlMatcher = new RegExp(`/photos*`);
    mock.onGet(photosUrlMatcher).reply(200, MOCK_PHOTOS);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("success", () => {
    it("should get places with 1 photo each", async () => {
      // arrange
      const { req, res } = createMocks({
        method: "GET",
        query: {
          lat: MOCK_LAT,
          long: MOCK_LONG,
        },
      });

      // act
      await handler(req, res);

      // assert

      // - assert we called the search endpoint with correct lat/long
      const apiCalls = mock.history.get;
      expect(apiCalls[0].url).toEqual(MOCK_SEARCH_ENDPOINT);

      // - status code
      expect(res._getStatusCode()).toBe(200);

      // - body
      const returnedPlaces = JSON.parse(res._getData());
      expect(returnedPlaces.length).toEqual(MOCK_PLACES.results.length);

      for (let place of returnedPlaces) {
        const expectedPlace = MOCK_PLACES.results.find(
          (x) => x.fsq_id === place.fsq_id
        );

        expect(place.name).toEqual(expectedPlace.name);
        expect(place.photo).toEqual(getPhotoPath(MOCK_PHOTOS[0]));

        // assert we called the photos endpoint for each place
        expect(
          apiCalls.find(
            (call) =>
              call.url === `/places/${expectedPlace.fsq_id}/photos?limit=1`
          )
        ).toBeDefined();
      }
    });
  });

  describe("error", () => {
    it("should get 405 for non implemented http method", async () => {
      const { req, res } = createMocks({
        method: "POST",
      });

      // act
      await handler(req, res);

      // assert
      const apiCalls = mock.history.get;
      expect(apiCalls.length).toEqual(0);

      // - status code
      expect(res._getStatusCode()).toBe(405);
    });

    it("should get 400 if any required query param is missing", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          def: "not",
          lat: "long",
        },
      });

      // act
      await handler(req, res);

      // assert
      const apiCalls = mock.history.get;
      expect(apiCalls.length).toEqual(0);

      // - status code
      expect(res._getStatusCode()).toBe(400);

      const body = JSON.parse(res._getData());
      expect(body.errorCode).toBe("PLACES001");
      expect(body.errorMsg).toBe(
        "Required query params missing. Required params: lat,long"
      );
    });

    it("should handle unexpected errors", async () => {
      // reset mocks so we can throw an error
      mock.reset();
      mock.onGet(MOCK_SEARCH_ENDPOINT).reply(500, "Something Bad Happened");

      const { req, res } = createMocks({
        method: "GET",
        query: {
          lat: MOCK_LAT,
          long: MOCK_LONG,
        },
      });

      // act
      await handler(req, res);

      // assert
      const apiCalls = mock.history.get;
      expect(apiCalls[0].url).toEqual(MOCK_SEARCH_ENDPOINT);

      // - status code
      expect(res._getStatusCode()).toBe(500);

      const body = JSON.parse(res._getData());
      expect(body).toEqual([]);
    });
  });
});
