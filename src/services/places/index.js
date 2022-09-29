import util from "util";

// api-client
import client from "../../api/clients/foursquare-client";

// constants
const FALLBACK_PHOTO_URL = "/assets/images/coming-soon.jpg";

const ENDPOINTS = {
  SEARCH_PLACES: "/places/search",
  GET_PLACES_PHOTOS: "/places/%s/photos",
};

export default async function getPlaces(lat, long) {
  const places = await getPlacesByLatLong(lat, long);

  const allPhotosResults = await getPlacesPhotos(places);

  addPhotoToPlaces(places, allPhotosResults);

  return places;
}

const getPlacesByLatLong = async (lat, long) => {
  const searchResponse = await client.get(
    `${ENDPOINTS.SEARCH_PLACES}?ll=${lat},${long}`
  );

  return searchResponse.data.results;
};

const getPlacesPhotos = async (places) => {
  const allPromises = [];
  // get photos for each place
  for (let place of places) {
    allPromises.push(
      client.get(
        `${util.format(ENDPOINTS.GET_PLACES_PHOTOS, place.fsq_id)}?limit=1` // adding limit=1 here because we only need 1 image
      )
    );
  }

  const allResults = await Promise.allSettled(allPromises);
  return allResults;
};

const addPhotoToPlaces = (places, allPhotosResults) => {
  for (let i = 0; i < allPhotosResults.length; i++) {
    const result = allPhotosResults[i];

    let photoUrl;
    if (result.status === "rejected") {
      // LOGGING: log this error according to the team's guidelines so our monitoring tool can pick it up and alert if needed
      photoUrl = FALLBACK_PHOTO_URL;
    } else {
      const imageResponse = result.value.data;

      // maybe foursquare doesn't have an image for every place
      photoUrl = imageResponse[0]
        ? getPhotoPath(imageResponse[0])
        : FALLBACK_PHOTO_URL;
    }

    places[i].photo = photoUrl;
  }
};

const getPhotoPath = (photo) => `${photo.prefix}original${photo.suffix}`;
