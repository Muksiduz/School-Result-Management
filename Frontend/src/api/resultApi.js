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

export const getDistinctStudents = (session_id, class_id, section_id) =>
  api.get(`/results/students`, {
    params: { session_id, class_id, section_id },
  });

export const getStudentUnitTests = (student_id, session_id) =>
  api.get(`/results/unit-tests`, {
    params: { student_id, session_id },
  });

export const getFullResult = (student_id, session_id, unit_test_id) =>
  api.get(`/results/full`, {
    params: { student_id, session_id, unit_test_id },
  });

export const getWholeClassResult = (session_id, class_id, section_id, test_id) =>
  api.get(`/results/class-result`,{
    params: { session_id, class_id, section_id, test_id },
  });
