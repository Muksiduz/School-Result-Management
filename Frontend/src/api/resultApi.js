import api from "../utils/axios";

export const enterMarks = (data) => api.post("/results/enter", data);

export const getStudentsByClassSection = (class_id, section_id) =>
  api.get(`/students/class/${class_id}/section/${section_id}`);

export const getSessions = () => api.get("/sessions");
export const getClasses = () => api.get("/classes");
export const getSectionsByClass = (class_id) =>
  api.get(`/sections/class/${class_id}`);
export const getUnitTestsBySession = (session_id) =>
  api.get(`/unit-test/session/${session_id}`);
export const getSubjectsByClass = (class_id) =>
  api.get(`/subjects/class/${class_id}`);
