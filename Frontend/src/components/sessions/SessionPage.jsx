import { useEffect, useState } from "react";
import {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../../services/sessionService";

import { useAuthStore } from "../../store/authStore";

import { Plus, Search, Pencil, Trash2, Save, X, Calendar } from "lucide-react";

function SessionPage() {
  const user = useAuthStore((state) => state.user);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createSession(formData);

      setFormData({
        name: "",
        year: "",
        start_date: "",
        end_date: "",
      });

      await fetchSessions();

      alert("Session Created Successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed To Create Session");
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

      setEditData({
        name: "",
        year: "",
        start_date: "",
        end_date: "",
      });

      await fetchSessions();

      alert("Session Updated Successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed To Update Session");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Session?")) {
      return;
    }

    try {
      await deleteSession(id);

      await fetchSessions();

      alert("Session Deleted Successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed To Delete Session");
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.year?.toString().includes(searchTerm),
  );

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar size={28} />
              Academic Sessions
            </h1>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
              Total: {filteredSessions.length}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Session Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-4 bg-blue-600 text-white p-3 rounded-lg flex justify-center items-center gap-2">
              <Plus size={18} />
              {loading ? "Creating..." : "Create Session"}
            </button>
          </form>

          <div className="relative mb-6">
            <Search size={18} className="absolute left-3 top-3.5" />

            <input
              type="text"
              placeholder="Search Session..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg"
            />
          </div>

          <div className="overflow-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Year</th>
                  <th className="border p-3">Start Date</th>
                  <th className="border p-3">End Date</th>
                  <th className="border p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.session_id}>
                    <td className="border p-3">
                      {editingId === session.session_id ? (
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              name: e.target.value,
                            })
                          }
                          className="border p-2 rounded w-full"
                        />
                      ) : (
                        session.name
                      )}
                    </td>

                    <td className="border p-3">
                      {editingId === session.session_id ? (
                        <input
                          value={editData.year}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              year: e.target.value,
                            })
                          }
                          className="border p-2 rounded w-full"
                        />
                      ) : (
                        session.year
                      )}
                    </td>

                    <td className="border p-3">
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
                          className="border p-2 rounded w-full"
                        />
                      ) : (
                        session.start_date?.split("T")[0]
                      )}
                    </td>

                    <td className="border p-3">
                      {editingId === session.session_id ? (
                        <input
                          type="date"
                          value={editData.end_date}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              end_date: e.target.value,
                            })
                          }
                          className="border p-2 rounded w-full"
                        />
                      ) : (
                        session.end_date?.split("T")[0]
                      )}
                    </td>

                    <td className="border p-3">
                      {user?.role === "admin" && (
                        <div className="flex gap-2">
                          {editingId === session.session_id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdate(session.session_id)}
                                className="bg-green-500 text-white p-2 rounded">
                                <Save size={16} />
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
                                className="bg-gray-500 text-white p-2 rounded">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEdit(session)}
                                className="bg-blue-500 text-white p-2 rounded">
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(session.session_id)}
                                className="bg-red-500 text-white p-2 rounded">
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredSessions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-5">
                      No Sessions Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default SessionPage;
