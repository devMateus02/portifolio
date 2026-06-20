import api from "./api";

export const uploadImage = async (
  image
) => {
  const response = await api.post(
    "/upload",
    {
      image,
    }
  );

  return response.data.url;
};