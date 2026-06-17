import { create } from "zustand";
import {
  getSessions,
  getClasses,
  getSectionsByClass,
  getUnitTestsBySession,
  getSubjectsByClass,
  getStudentsByClassSection,
  enterMarks,
} from "../api/resultApi.js";

const useMarksEntryStore = create((set, get) => ({
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
  selectedSubject: null,

  // marks input { student_id: marks_obtained }
  marks: {},

  loading: false,
  error: null,
  success: false,

  // fetch on mount
  fetchInitialData: async () => {
    try {
      const [sessionsRes, classesRes] = await Promise.all([
        getSessions(),
        getClasses(),
      ]);
    //   console.log(sessionsRes.data, classesRes.data.classes);
      set({ sessions: sessionsRes.data, classes: classesRes.data.classes });
    } catch (err) {
      set({ error: err.message });
    }
  },

  setSelectedSession: async (session) => {
    set({ selectedSession: session, selectedUnitTest: null, unitTests: [] });
    try {
      console.log("calling unit tests for session:", session.session_id);
      const res = await getUnitTestsBySession(session.session_id);
      console.log("unit tests:", res.data);
      set({ unitTests: res.data });
      
    } catch (err) {
      set({ error: err.message });
    }
  },

  setSelectedClass: async (cls) => {
    set({
      selectedClass: cls,
      selectedSection: null,
      selectedSubject: null,
      sections: [],
      subjects: [],
      students: [],
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
    set({ selectedSection: section, students: [], marks: {} });
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
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),

  setMark: (student_id, marks_obtained) =>
    set((state) => ({
      marks: { ...state.marks, [student_id]: marks_obtained },
    })),

  submitMarks: async () => {
    const {
      selectedSession,
      selectedClass,
      selectedSection,
      selectedUnitTest,
      selectedSubject,
      marks,
      students,
    } = get();
    console.log("selectedUnitTest:", selectedUnitTest);

    

    const marksArray = students.map((s) => ({
      student_id: s.student_id,
      marks_obtained: Number(marks[s.student_id] || 0),
    }));

    set({ loading: true, error: null, success: false });
    try {
      const payload = {
        session_id: selectedSession.session_id,
        class_id: selectedClass.class_id,
        section_id: selectedSection.section_id,
        unit_test_id: selectedUnitTest.test_id,
        subject_id: selectedSubject.subject_id,
        marks: marksArray,
      };
      console.log("payload:", payload);
      await enterMarks({
        session_id: selectedSession.session_id,
        class_id: selectedClass.class_id,
        section_id: selectedSection.section_id,
        unit_test_id: selectedUnitTest.test_id,
        subject_id: selectedSubject.subject_id,
        marks: marksArray,
      });
      set({ success: true, marks: {} });
    } catch (err) {
      set({ error: err.message });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useMarksEntryStore;
