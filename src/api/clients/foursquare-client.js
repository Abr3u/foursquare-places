import axios from "axios";

// TODO: process.env
const BASE_URL = "https://api.foursquare.com/v3";
const DEFAULT_TIMEOUT = 4000;
const API_KEY = "fsq3Wy3+RUvdvcRLm4DkXbqHwQjIUUjaZcaQNxBWYjuZGhE=";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    Authorization: API_KEY,
  },
});

export default client;
