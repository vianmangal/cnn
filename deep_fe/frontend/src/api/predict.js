import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function predictEmotion(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/predict`,
    formData
  );

  return response.data;
}

console.log("API_URL =", import.meta.env.VITE_API_URL);