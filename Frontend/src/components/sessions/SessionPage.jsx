import { useEffect, useState } from "react";
import {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../../services/sessionService";

import { useAuthStore } from "../../store/authStore";

import { Plus, Search, Pencil, Trash2, Save, X, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

function SessionPage() {
  const user = useAuthStore((state) => state.user);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    year: "",
    start_date: "",
    end_date: "",
  });

  const [editData, setEditData] = useState({
    name: "",
    year: "",
    start_date: "",
    end_date: "",
  });

  const fetchSessions = async () => {
    try {
      const data = await getAllSessions();
      setSessions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createSession(formData);
      setFormData({ name: "", year: "", start_date: "", end_date: "" });
      await fetchSessions();
      setShowForm(false);
      toast.success("Session Created Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed To Create Session");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session) => {
    setEditingId(session.session_id);
    setEditData({
      name: session.name || "",
      year: session.year || "",
      start_date: session.start_date ? session.start_date.split("T")[0] : "",
      end_date: session.end_date ? session.end_date.split("T")[0] : "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      await updateSession(id, editData);
      setEditingId(null);
      setEditData({ name: "", year: "", start_date: "", end_date: "" });
      await fetchSessions();
      toast.success("Session Updated Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed To Update Session");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Session?")) return;
    try {
      await deleteSession(id);
      await fetchSessions();
      toast.success("Session Deleted Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed To Delete Session");
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.year?.toString().includes(searchTerm),
  );

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Home / Sessions</p>
          <h1 className="text-2xl font-semibold text-gray-800">
            Academic Sessions
          </h1>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus size={16} />
            Add Session
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gray-700">
            Sessions Information
          </h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-52"
              />
            </div>
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              Total: {filteredSessions.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  End Date
                </th>
                {user?.role === "admin" && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredSessions.map((session) => (
                <tr
                  key={session.session_id}
                  className="border-b border-gray-50 hover:bg-purple-50/40 transition-colors">
                  {/* Name */}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <Calendar size={14} />
                      </div>
                      {editingId === session.session_id ? (
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                        />
                      ) : (
                        <span className="font-medium text-gray-700">
                          {session.name}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Year */}
                  <td className="px-6 py-3">
                    {editingId === session.session_id ? (
                      <input
                        value={editData.year}
                        onChange={(e) =>
                          setEditData({ ...editData, year: e.target.value })
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-24 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      />
                    ) : (
                      <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        {session.year}
                      </span>
                    )}
                  </td>

                  {/* Start Date */}
                  <td className="px-6 py-3 text-gray-500">
                    {editingId === session.session_id ? (
                      <input
                        type="date"
                        value={editData.start_date}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            start_date: e.target.value,
                          })
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      />
                    ) : (
                      session.start_date?.split("T")[0] || "—"
                    )}
                  </td>

                  {/* End Date */}
                  <td className="px-6 py-3 text-gray-500">
                    {editingId === session.session_id ? (
                      <input
                        type="date"
                        value={editData.end_date}
                        onChange={(e) =>
                          setEditData({ ...editData, end_date: e.target.value })
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      />
                    ) : (
                      session.end_date?.split("T")[0] || "—"
                    )}
                  </td>

                  {/* Actions */}
                  {user?.role === "admin" && (
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {editingId === session.session_id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdate(session.session_id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 transition-colors">
                              <Save size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditData({
                                  name: "",
                                  year: "",
                                  start_date: "",
                                  end_date: "",
                                });
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-100 transition-colors">
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(session)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 transition-colors">
                              <Pencil size={14} />
                            </button>
                            {/* <button
                              type="button"
                              onClick={() => handleDelete(session.session_id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-colors">
                              <Trash2 size={14} />
                            </button> */}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <Calendar size={36} className="mx-auto mb-2 opacity-30" />
                    No sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Session Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Session
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Create a new academic session
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <form
              id="sessionForm"
              onSubmit={handleSubmit}
              className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Session Details
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Session Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Spring 2026"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Year *</label>
                  <input
                    type="text"
                    name="year"
                    placeholder="e.g. 2026"
                    value={formData.year}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                form="sessionForm"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                <Plus size={15} />
                {loading ? "Creating..." : "Create Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionPage;
