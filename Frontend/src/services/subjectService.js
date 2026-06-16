import api from "../utils/axios";

export const getAllSubjects = async () => {
  const res = await api.get("/subjects");
  return res.data;
};

export const getSubjectsByClass = async (classId) => {
  const res = await api.get(`/subjects/class/${classId}`);
  return res.data;
};

export const createSubject = async (data) => {
  const res = await api.post("/subjects", data);
  return res.data;
};

export const updateSubject = async (id, data) => {
  const res = await api.put(`/subjects/${id}`, data);
  return res.data;
};

export const deleteSubject = async (id) => {
  const res = await api.delete(`/subjects/${id}`);
  return res.data;
};
