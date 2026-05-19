import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL + "/auth";

export const signup = async (data) => {
  const response = await axios.post(`${API}/signup`, data);

  return response.data;
};

export const signin = async (data) => {
  const response = await axios.post(`${API}/signin`, data, {
    withCredentials: true,
  });

  return response.data;
};

export const logout = async (data) => {
  const response = await axios.delete(`${API}/logout`, {
    withCredentials: true,
  });

  return response.data;
};

export const auth = async () => {
  const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
  console.log(response.data);
  return response.data;
};
