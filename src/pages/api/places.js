import getPlaces from "../../services/places";

// constants
const REQUIRED_QUERY_PARAMS = ["lat", "long"];

// errors
const ERRORS = {
  REQUIRED_QUERY_PARAMS_MISSING: {
    errorCode: "PLACES001",
    errorMsg: `Required query params missing. Required params: ${REQUIRED_QUERY_PARAMS}`,
  },
};

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
    res.status(200).json(places);
  } catch (error) {
    console.log("---> api/places ERROR ", error);
    // LOGGING: log this error according to the team's guidelines so our monitoring tool can pick it up and alert if needed
    res.status(500).json([]);
  }
}
