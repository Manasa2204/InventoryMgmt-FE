import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL + "/settings";

export const getSettings = async () => {
  const response = await axios.get(API, {
    withCredentials: true,
  });

  return response.data;
};

export const updateSettings = async (body) => {
  const response = await axios.post(API, body, {
    withCredentials: true,
  });

  return response.data;
};
