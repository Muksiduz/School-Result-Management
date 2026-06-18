import { create } from "zustand";
import {
  getDistinctStudents,
  getStudentUnitTests,
  getFullResult,
  getSectionsByClass,
  getSubjectsByClass,
  getWholeClassResult,
} from "../api/resultApi.js";

const useViewResultStore = create((set, get) => ({
  // selections
  selectedSession: null,
  selectedClass: null,
  selectedSection: null,
  selectedStudent: null,
  selectedUnitTest: null,

  // data
  students: [],
  unitTests: [],
  fullResult: [],
  sections: [],
  classResults: [],

  loading: false,
  error: null,

  // setters that reset downstream state
  setSelectedSession: (session) =>
    set({
      selectedSession: session,
      selectedClass: null,
      selectedSection: null,
      selectedStudent: null,
      selectedUnitTest: null,
      students: [],
      unitTests: [],
      fullResult: [],
    }),

  setSelectedClass: async (cls) => {
    set({
      selectedClass: cls,
      selectedSection: null,
      selectedStudent: null,
      selectedUnitTest: null,
      students: [],
      unitTests: [],
      fullResult: [],
    });
    try {
      const [sectionsRes, subjectsRes] = await Promise.all([
        getSectionsByClass(cls.class_id),
        getSubjectsByClass(cls.class_id),
      ]);
      set({ sections: sectionsRes.data });
    } catch (err) {
      set({ error: err.message });
    }
  },

  setSelectedSection: (section) =>
    set({
      selectedSection: section,
      selectedStudent: null,
      selectedUnitTest: null,
      students: [],
      unitTests: [],
      fullResult: [],
    }),

  fetchStudents: async () => {
    const { selectedSession, selectedClass, selectedSection } = get();
    set({ loading: true, error: null });
    try {
      const res = await getDistinctStudents(
        selectedSession.session_id,
        selectedClass.class_id,
        selectedSection.section_id,
      );
      set({ students: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchUnitTests: async (student) => {
    const { selectedSession } = get();
    set({
      selectedStudent: student,
      loading: true,
      error: null,
      unitTests: [],
      fullResult: [],
    });
    try {
      const res = await getStudentUnitTests(
        student.student_id,
        selectedSession.session_id,
      );
      set({ unitTests: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchFullResult: async (unitTest) => {
    const { selectedStudent, selectedSession } = get();
    set({
      selectedUnitTest: unitTest,
      loading: true,
      error: null,
      fullResult: [],
    });
    try {
      const res = await getFullResult(
        selectedStudent.student_id,
        selectedSession.session_id,
        unitTest.test_id,
      );
      set({ fullResult: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

fetchFullClassResults: async () => {
    const {selectedSession,selectedClass,selectedSection, selectedUnitTest} = get();
    set({loading: true, error: null});
    try {
        const res = await getWholeClassResult(selectedSession.session_id,selectedClass.class_id,selectedSection.section_id,selectedUnitTest.test_id);
        set({classResults: res.data});
    } catch (error) {
        set({error: error.message});
    } finally {
        set({loading: false});
    }
};

export default useViewResultStore;
