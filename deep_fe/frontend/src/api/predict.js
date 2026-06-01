import client from "./client";

export async function predictEmotion(file) {
  const formData = new FormData();

  formData.append("image", file);
  const response = await client.post("/predict", formData);

  return response.data;
}
