import {create} from 'zustand'
import { createOldSession, deleteOldSession, getOldSessions, updateOldSession } from '../utils/oldSessionsApi';

export const useOldSessionStore = create((set,get) => ({
    oldSessions: [],
    loading: false,
    error: null,

    fetchOldSessions: async () => {
        set({loading: true, error: null});
        try {
            const res = await getOldSessions();
            set({oldSessions: res.data});
        } catch (err) {
            set({error: err.message});
        } finally {
            set({loading: false});
        }
    },
    createOldSession: async (data) => {
        set({loading: true, error: null});
        try {
            const res = await createOldSession(data);
            await get().fetchOldSessions();
        } catch (err) {
            set({error: err.message});
        } finally {
            set({loading: false});
        }
    },
    updateOldSession: async (id, data) => {
        set({loading: true, error: null});
        try {
            const res = await updateOldSession(id, data);
            await get().fetchOldSessions();
        } catch (err) {
            set({error: err.message});
        } finally {
            set({loading: false});
        }
    },
    deleteOldSession: async (id) => {
        set({loading: true, error: null});
        try {
            const res = await deleteOldSession(id);
            await get().fetchOldSessions();
        } catch (err) {
            set({error: err.message});
        } finally {
            set({loading: false});
        }
    },
}))