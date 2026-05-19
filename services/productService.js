import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL + "/products";

export const getProducts = async (searchParams) => {
  const response = await axios.get(`${API}/getAll`, {
    params: { search: searchParams },
    withCredentials: true,
  });

  return response.data;
};

export const createProduct = async (data) => {
  const response = await axios.post(`${API}/add`, data, {
    withCredentials: true,
  });

  return response.data;
};

export const getProduct = async (id) => {
  const response = await axios.get(`${API}/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export const adjustProduct = async (id, body) => {
  const response = await axios.post(`${API}/${id}/adjust`, body, {
    withCredentials: true,
  });

  return response.data;
};
