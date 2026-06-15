import api from "../utils/axios";

export const getAllStudents = async () => {
  const response = await api.get("/students");

  return response.data;
};

export const getSingleStudent = async (id) => {
  const response = await api.get(`/students/${id}`);

  return response.data;
};

export const getStudentsByClass = async (id) => {
  const response = await api.get(`/students/class/${id}`);

  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await api.post("/students", studentData);

  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/students/${id}`, studentData);

  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);

  return response.data;
};
