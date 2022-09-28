import util from "util";
import axios from "axios";

// utils
import { getPhotoPath } from "../../utils/functions";

// constants
const REQUIRED_QUERY_PARAMS = ["lat", "long"];
const FALLBACK_PHOTO_URL = "/assets/images/coming-soon.jpg";

const ENDPOINTS = {
  SEARCH_PLACES: "https://api.foursquare.com/v3/places/search",
  GET_PLACES_PHOTOS: "https://api.foursquare.com/v3/places/%s/photos",
};

// errors
const ERRORS = {
  REQUIRED_QUERY_PARAMS_MISSING: {
    errorCode: "PLACES001",
    errorCode: `Required query params missing. Required params: ${REQUIRED_QUERY_PARAMS} `,
  },
};


// TODO: env file
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  const query = req.query;
  const queryParams = Object.keys(query);

  if (!REQUIRED_QUERY_PARAMS.every((param) => queryParams.includes(param))) {
    res.status(400).json(ERRORS.REQUIRED_QUERY_PARAMS_MISSING);
    return;
  }

  try {
    const places = await getPlaces(query.lat, query.long);

    const allPhotosResults = await getPlacesPhotos(places);

    addPhotoToPlaces(places, allPhotosResults);

    res.status(200).json(places);
  } catch (error) {
    console.log("---> api/places ERROR ", error);
    // IMPROV: log this error according to the team's guidelines so our monitoring tool can pick it up and alert if needed
    res.status(500).json([]);
  }
}

const getPlaces = async (lat, long) => {
  const searchResponse = await axios.get(
    `${ENDPOINTS.SEARCH_PLACES}?ll=${lat},${long}`,
    {
      headers: {
        Authorization: "fsq3Wy3+RUvdvcRLm4DkXbqHwQjIUUjaZcaQNxBWYjuZGhE=",
      },
    }
  );

  return searchResponse.data.results;
};

const getPlacesPhotos = async (places) => {
  const allPromises = [];
  // get photos for each place
  for (let place of places) {
    allPromises.push(
      axios.get(
        `${util.format(ENDPOINTS.GET_PLACES_PHOTOS, place.fsq_id)}?limit=1`, // adding limit=1 here because we only need 1 image
        {
          headers: {
            Authorization: "fsq3Wy3+RUvdvcRLm4DkXbqHwQjIUUjaZcaQNxBWYjuZGhE=",
          },
        }
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
      // IMPROV: log this error according to the team's guidelines so our monitoring tool can pick it up and alert if needed
      photoUrl = FALLBACK_PHOTO_URL;
    } else {
      const imageResponse = result.value.data;

      // maybe foursquare doesnt have an image for every place
      photoUrl = imageResponse[0]
        ? getPhotoPath(imageResponse[0])
        : FALLBACK_PHOTO_URL;
    }

    places[i].photo = photoUrl;
  }
};
