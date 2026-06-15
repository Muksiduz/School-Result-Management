import api from "../utils/axios";

// GET all sections
export const getAllSections = async () => {
  const response = await api.get("/sections");
  return response.data;
};

// GET sections by class
export const getSectionsByClass = async (classId) => {
  const response = await api.get(`/sections/class/${classId}`);
  return response.data;
};

// CREATE section
export const createSection = async (sectionData) => {
  const response = await api.post("/sections", sectionData);
  return response.data;
};

// UPDATE section
export const updateSection = async (id, sectionData) => {
  const response = await api.put(`/sections/${id}`, sectionData);
  return response.data;
};

// DELETE section
export const deleteSection = async (id) => {
  const response = await api.delete(`/sections/${id}`);
  return response.data;
};
