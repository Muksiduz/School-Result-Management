import { create } from "zustand";
import {
  getClasses,
  getSectionsByClass,
  getSessions,
  getUnitTestsBySession,
  getWholeClassResult,
} from "../api/resultApi";

const useViewClassResultStore = create((set, get) => ({
  sessions: [],
  classes: [],
  sections: [],
  unitTest: [],
  results: [],

  selectedSession: null,
  selectedClass: null,
  selectedSection: null,
  selectedUnitTest: null,

  error: null,
  loading: false,

  initialFetch: async () => {
    try {
      const [sessionsRes, classesRes] = await Promise.all([
        getSessions(),
        getClasses(),
      ]);
      set({ sessions: sessionsRes.data, classes: classesRes.data.classes });
    } catch (error) {
      set({ error: error.message });
    }
  },
  setSelectedSession: async (session) => {
    set({ selectedSession: session, selectedUnitTest: null, unitTest: [] });
    try {
      const res = await getUnitTestsBySession(session.session_id);
      // console.log(res)
      set({ unitTest: res.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  setSelectedClass: async (cls) => {
    set({ selectedClass: cls, selectedSection: null, sections: [] });
    try {
      const res = await getSectionsByClass(cls.class_id);
      // console.log(res)
      set({ sections: res.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  setSelectedSection: (sec) => {
    set({ selectedSection: sec });
  },
  setSelectedUnitTest: (tst) => {
    set({ selectedUnitTest: tst });
  },
  fetchFullClassResults: async () => {
    const {
      selectedSession,
      selectedClass,
      selectedSection,
      selectedUnitTest,
    } = get();
    set({ loading: true, error: null });
    try {
      const res = await getWholeClassResult(
        selectedSession.session_id,
        selectedClass.class_id,
        selectedSection.section_id,
        selectedUnitTest.test_id,
      );
      set({ results: res.data });
    } catch (error) {
      set({ error: error.message });
      // console.log(error)
    } finally {
      set({ loading: false });
    }
  },
}));

export default useViewClassResultStore;
