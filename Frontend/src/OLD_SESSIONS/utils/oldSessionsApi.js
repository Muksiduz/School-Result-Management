    import api from "../../utils/axios";

    export function getOldSessions() {
    return api.get("/old-sessions");
    }

    export function getSingleOldSession(id) {
    return api.get(`/old-sessions/${id}`);
    }

    export function createOldSession(data) {
    return api.post("/old-sessions", data);
    }

    export function updateOldSession(id, data) {
    return api.put(`/old-sessions/${id}`, data);
    }

    export function deleteOldSession(id) {
    return api.delete(`/old-sessions/${id}`);
    }
