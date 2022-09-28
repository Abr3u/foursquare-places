import axios from "axios";

const BASE_URL = process.env.FOURSQUARE_BASE_URL;
const DEFAULT_TIMEOUT = process.env.DEFAULT_TIMEOUT;
const API_KEY = process.env.API_KEY;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    Authorization: API_KEY,
  },
});

export default client;
