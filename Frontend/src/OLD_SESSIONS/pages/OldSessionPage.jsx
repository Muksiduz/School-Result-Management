import { useEffect, useMemo, useState } from "react";
import { Calendar, Plus, Search, Pencil, Trash2, Save, X } from "lucide-react";

import { useOldSessionStore } from "../store/oldSessionStore";

const OldSessionPage = () => {
  const {
    oldSessions,
    loading,
    error,
    fetchOldSessions,
    createOldSession,
    updateOldSession,
    deleteOldSession,
  } = useOldSessionStore();

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedSession, setSelectedSession] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    year: "",
  });

  useEffect(() => {
    fetchOldSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    return oldSessions.filter(
      (session) =>
        session.name?.toLowerCase().includes(search.toLowerCase()) ||
        session.year?.toString().includes(search),
    );
  }, [oldSessions, search]);

  const handleCreate = async () => {
    if (!formData.name || !formData.year) {
      return alert("Please fill all fields");
    }

    await createOldSession(formData);

    setFormData({
      name: "",
      year: "",
    });

    setShowAddModal(false);
  };

  const handleEditClick = (session) => {
    setSelectedSession(session);

    setFormData({
      name: session.name,
      year: session.year,
    });

    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    await updateOldSession(selectedSession.old_session_id, formData);

    setShowEditModal(false);

    setSelectedSession(null);

    setFormData({
      name: "",
      year: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;

    await deleteOldSession(id);
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Academic / Old Sessions</p>

          <h1 className="text-4xl font-bold text-slate-800 mt-2">
            Old Academic Sessions
          </h1>

          <p className="text-gray-500 mt-2">
            Manage previously completed academic sessions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-3 rounded-xl shadow">
          <Plus size={18} />
          Add Session
        </button>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow border border-purple-100 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Sessions</p>

              <h2 className="text-4xl font-bold text-purple-600 mt-2">
                {oldSessions.length}
              </h2>
            </div>

            <div className="bg-purple-100 p-3 rounded-xl">
              <Calendar className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl shadow border border-purple-100 p-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-4 text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search session..."
            className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow border border-purple-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-50">
            <tr>
              <th className="text-left px-6 py-4">Session Name</th>

              <th className="text-left px-6 py-4">Year</th>

              <th className="text-center px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSessions.map((session) => (
              <tr
                key={session.old_session_id}
                className="border-t hover:bg-purple-50 transition">
                <td className="px-6 py-5 font-medium">{session.name}</td>

                <td className="px-6 py-5">{session.year}</td>

                <td className="px-6 py-5">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(session)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
                      <Pencil size={16} />
                    </button>

                    {/* <button
                      onClick={() => handleDelete(session.old_session_id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg">
                      <Trash2 size={16} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredSessions.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-500">
                  No Sessions Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-center text-purple-600 font-semibold">
          Loading...
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-xl">{error}</div>
      )}

      {/* ===========================
          ADD MODAL HERE (PART 2)
      ============================ */}

      {/* ===========================
          EDIT MODAL HERE (PART 2)
      ============================ */}
      {/* ADD MODAL */}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                Add Old Session
              </h2>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Session Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="2024-2025"
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Year</label>

                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: e.target.value,
                    })
                  }
                  placeholder="2024"
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-3 rounded-xl border hover:bg-gray-100">
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl">
                <Save size={18} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                Edit Old Session
              </h2>

              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Session Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Year</label>

                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSession(null);
                }}
                className="px-5 py-3 rounded-xl border hover:bg-gray-100">
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl">
                <Save size={18} />
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OldSessionPage;
