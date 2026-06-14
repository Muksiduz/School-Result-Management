import api from "../utils/axios";

export const getAllUsers = async () => {
  const response = await api.get("/auth/get-all-user");

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/auth/delete-user/${id}`);

  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/auth/update-user/${id}`, userData);

  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/auth/create-user", userData);

  return response.data;
};
