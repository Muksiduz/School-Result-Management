import { useEffect, useState } from "react";
import {
  getAllUnitTests,
  createUnitTest,
  updateUnitTest,
  deleteUnitTest,
} from "../../services/unitTestService";
import { getAllSessions } from "../../services/sessionService";
import { useAuthStore } from "../../store/authStore";
import {
  ClipboardList,
  Plus,
  Search,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";

function ExamPage() {
  const user = useAuthStore((state) => state.user);

  const [tests, setTests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    session_id: "",
    max_marks: "",
  });
  const [editData, setEditData] = useState({ name: "", max_marks: "" });

  const fetchTests = async () => {
    try {
      const data = await getAllUnitTests();
      setTests(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await getAllSessions();
      setSessions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchSessions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createUnitTest({
        ...formData,
        session_id: Number(formData.session_id),
        max_marks: Number(formData.max_marks),
      });
      setFormData({ name: "", session_id: "", max_marks: "" });
      fetchTests();
      setShowForm(false);
      alert("Exam Created Successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed To Create Exam");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test) => {
    setEditingId(test.test_id);
    setEditData({ name: test.name, max_marks: test.max_marks });
  };

  const handleUpdate = async (id) => {
    try {
      await updateUnitTest(id, {
        name: editData.name,
        max_marks: Number(editData.max_marks),
      });
      setEditingId(null);
      fetchTests();
      alert("Exam Updated Successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed To Update Exam");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Exam?")) return;
    try {
      await deleteUnitTest(id);
      fetchTests();
      alert("Exam Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.session_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSession =
      !selectedSession || String(test.session_id) === String(selectedSession);
    return matchesSearch && matchesSession;
  });

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Home / Exams</p>
          <h1 className="text-2xl font-semibold text-gray-800">
            Exam Management
          </h1>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus size={16} />
            Add Exam
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gray-700">
            Exams Information
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-48"
              />
            </div>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
              <option value="">All Sessions</option>
              {sessions.map((session) => (
                <option key={session.session_id} value={session.session_id}>
                  {session.name}
                </option>
              ))}
            </select>
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              Total: {filteredTests.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Max Marks
                </th>
                {user?.role === "admin" && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr
                  key={test.test_id}
                  className="border-b border-gray-50 hover:bg-purple-50/40 transition-colors">
                  <td className="px-6 py-3">
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-md">
                      #{test.test_id}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <ClipboardList size={14} />
                      </div>
                      {editingId === test.test_id ? (
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                        />
                      ) : (
                        <span className="font-medium text-gray-700">
                          {test.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md">
                      {test.session_name}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {editingId === test.test_id ? (
                      <input
                        type="number"
                        value={editData.max_marks}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            max_marks: e.target.value,
                          })
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-20 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      />
                    ) : (
                      <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        {test.max_marks}
                      </span>
                    )}
                  </td>
                  {user?.role === "admin" && (
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {editingId === test.test_id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdate(test.test_id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 transition-colors">
                              <Save size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-100 transition-colors">
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(test)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 transition-colors">
                              <Pencil size={14} />
                            </button>
                            {/* <button
                              type="button"
                              onClick={() => handleDelete(test.test_id)}
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
              {filteredTests.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <ClipboardList
                      size={36}
                      className="mx-auto mb-2 opacity-30"
                    />
                    No exams found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exam Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Exam
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Create a new exam record
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form
              id="examForm"
              onSubmit={handleSubmit}
              className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Exam Details
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div>
                <label className={labelClass}>Exam Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term Exam"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Session *</label>
                <select
                  value={formData.session_id}
                  onChange={(e) =>
                    setFormData({ ...formData, session_id: e.target.value })
                  }
                  className={inputClass}
                  required>
                  <option value="">Select session</option>
                  {sessions.map((session) => (
                    <option key={session.session_id} value={session.session_id}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Max Marks *</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={formData.max_marks}
                  onChange={(e) =>
                    setFormData({ ...formData, max_marks: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                form="examForm"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                <Plus size={15} />
                {loading ? "Creating..." : "Add Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamPage;
