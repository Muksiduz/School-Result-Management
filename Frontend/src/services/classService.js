import api from "../utils/axios";

export const createClass = async (classData) => {
  const response = await api.post("/classes", classData);

  return response.data;
};

export const getAllClasses = async () => {
  const response = await api.get("/classes");

  return response.data;
};

export const updateClass = async (id, classData) => {
  const response = await api.put(`/classes/${id}`, classData);

  return response.data;
};

export const deleteClass = async (id) => {
  const response = await api.delete(`/classes/${id}`);

  return response.data;
};
