import { create } from "zustand";
import { getClasses, getSectionsByClass, getSessions, getStudentsByClassSection, getSubjectsByClass, getUnitTestsBySession } from "../../api/resultApi.js";
import api from "../../utils/axios.js";



const useMarksEntryAllStore = create((set, get) => ({
  // dropdown data
  sessions: [],
  classes: [],
  sections: [],
  unitTests: [],
  subjects: [],
  students: [],

  // selections
  selectedSession: null,
  selectedClass: null,
  selectedSection: null,
  selectedUnitTest: null,
  selectedStudent: null,

  // marks { subject_id: marks_obtained }
  marks: {},

  loading: false,
  error: null,
  success: false,

  fetchInitialData: async () => {
    try {
      const [sessionsRes, classesRes] = await Promise.all([
        getSessions(),
        getClasses(),
      ]);
      set({ sessions: sessionsRes.data, classes: classesRes.data.classes });
    } catch (err) {
      set({ error: err.message });
    }
  },

  setSelectedSession: async (session) => {
    set({ selectedSession: session, selectedUnitTest: null, unitTests: [] });
    try {
      const res = await getUnitTestsBySession(session.session_id);
      set({ unitTests: res.data });
    } catch (err) {
      set({ error: err.message });
    }
  },

  setSelectedClass: async (cls) => {
    set({
      selectedClass: cls,
      selectedSection: null,
      sections: [],
      subjects: [],
      students: [],
      selectedStudent: null,
      marks: {},
    });
    try {
      const [sectionsRes, subjectsRes] = await Promise.all([
        getSectionsByClass(cls.class_id),
        getSubjectsByClass(cls.class_id),

      ]);
      set({ sections: sectionsRes.data, subjects: subjectsRes.data });
    } catch (err) {
      set({ error: err.message });
    }
  },

  setSelectedSection: async (section) => {
    set({
      selectedSection: section,
      students: [],
      selectedStudent: null,
      marks: {},
    });
    const { selectedClass } = get();
    try {
      const res = await getStudentsByClassSection(
        selectedClass.class_id,
        section.section_id,
      );
      set({ students: res.data });
    } catch (err) {
      set({ error: err.message });
    }
  },

  setSelectedUnitTest: (unitTest) => set({ selectedUnitTest: unitTest }),

  setSelectedStudent: (student) =>
    set({ selectedStudent: student, marks: {}, success: false, error: null }),

  setMark: (subject_id, marks_obtained) =>
    set((state) => ({
      marks: { ...state.marks, [subject_id]: marks_obtained },
    })),

  submitMarks: async () => {
    const {
      selectedSession,
      selectedClass,
      selectedSection,
      selectedUnitTest,
      selectedStudent,
      marks,
      subjects,
    } = get();

    const entries = subjects.map((sub) => ({
      student_id: selectedStudent.student_id,
      subject_id: sub.subject_id,
      marks_obtained: Number(marks[sub.subject_id] || 0),
    }));

    set({ loading: true, error: null, success: false });
    try {
      await api.post("/results/enter-all", {
        session_id: selectedSession.session_id,
        class_id: selectedClass.class_id,
        section_id: selectedSection.section_id,
        unit_test_id: selectedUnitTest.test_id,
        entries,
      });
      set({ success: true, marks: {} });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useMarksEntryAllStore;
