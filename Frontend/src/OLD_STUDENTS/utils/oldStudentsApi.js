import api from "../../utils/axios.js";
export function getAllOldStudents() {
  return api.get("/old-students");
}

export function getSingleOldStudents(id) {
  return api.get(`/old-students/${id}`);
}

export function getOldStudentsBySession(id) {
  return api.get(`/old-students/session/${id}`);
}

export function createOldStudents(data) {
  return api.post("/old-students", data);
}

export function updateOldStudents(id, data) {
  return api.put(`/old-students/${id}`, data);
}

export function deleteOldStudents(id) {
  return api.delete(`/old-students/${id}`);
}
