import {create} from 'zustand';
import { getOldSessions } from '../../OLD_SESSIONS/utils/oldSessionsApi.js';
import { createOldStudents, getAllOldStudents, getOldStudentsBySession } from '../utils/oldStudentsApi.js';

export const useOldStudentsStore = create((set,get) => ({
    oldStudents:[],

    loading: false,
    error: null,

    oldSession:[],

    selectedSession:null,

    initialFetch: async() => {
        try {
            const stu_res = await getAllOldStudents();
            const res = await getOldSessions();
            set({oldStudents:stu_res.data, oldSession:res.data});
        } catch (error) {
            set({error:error.message});
            console.log(error)
        }
    },

    setSelectedSession: async (session) => {
        set({ selectedSession: session, oldStudents: []});
        try {
            const res = await getOldStudentsBySession(session.old_session_id);
            set({ oldStudents: res.data });
        } catch (error) {
            set({ error: error.message });
        }
    },

    createOldStudents: async (data) => {
        try {
            const res = await createOldStudents(data);
            set({ oldStudents: [...get().oldStudents, res.data] });
        } catch (error) {
            set({ error: error.message });
        }
    },
}))