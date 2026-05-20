import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL + "/dashboard";

export const getDashboard = async () => {
  const response = await axios.get(API, {
    withCredentials: true,
  });

  return response.data;
};
