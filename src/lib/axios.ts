import axios from "axios";
import { API_URL_WC, consumerKey, consumerSecret } from "@/constants/api";

export const axiosInstance = axios.create({
  baseURL: API_URL_WC,
  timeout: 10_000,
  headers: {
    Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
  },
  withCredentials: false,
});
