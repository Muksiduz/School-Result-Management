import api from "../utils/axios";

export const loginUser = async (formData) => {
  const response = await api.post("/auth/login", formData);

  return response.data;
};
