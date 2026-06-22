import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export default axios.create({
  baseURL: apiBaseUrl,
});
