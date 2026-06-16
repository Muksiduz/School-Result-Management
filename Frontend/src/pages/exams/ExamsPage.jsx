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

  const [formData, setFormData] = useState({
    name: "",
    session_id: "",
    max_marks: "",
  });

  const [editData, setEditData] = useState({
    name: "",
    max_marks: "",
  });

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

      setFormData({
        name: "",
        session_id: "",
        max_marks: "",
      });

      fetchTests();

      alert("Exam Created Successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed To Create Exam");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test) => {
    setEditingId(test.test_id);

    setEditData({
      name: test.name,
      max_marks: test.max_marks,
    });
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
      console.log(error);

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

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex gap-2 items-center">
            <ClipboardList size={28} />
            Exam Management
          </h1>

          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
            Total: {filteredTests.length}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Exam Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <select
            value={formData.session_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                session_id: e.target.value,
              })
            }
            className="border p-3 rounded-lg">
            <option value="">Select Session</option>

            {sessions.map((session) => (
              <option key={session.session_id} value={session.session_id}>
                {session.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Max Marks"
            value={formData.max_marks}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_marks: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg flex justify-center items-center gap-2">
            <Plus size={18} />

            {loading ? "Creating..." : "Create Exam"}
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3.5" />

            <input
              type="text"
              placeholder="Search Exam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg"
            />
          </div>

          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="border p-3 rounded-lg">
            <option value="">All Sessions</option>

            {sessions.map((session) => (
              <option key={session.session_id} value={session.session_id}>
                {session.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">ID</th>

                <th className="border p-3">Exam Name</th>

                <th className="border p-3">Session</th>

                <th className="border p-3">Max Marks</th>

                <th className="border p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.test_id}>
                  <td className="border p-3">{test.test_id}</td>

                  <td className="border p-3">
                    {editingId === test.test_id ? (
                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            name: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                      />
                    ) : (
                      test.name
                    )}
                  </td>

                  <td className="border p-3">{test.session_name}</td>

                  <td className="border p-3">
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
                        className="border p-2 rounded"
                      />
                    ) : (
                      test.max_marks
                    )}
                  </td>

                  <td className="border p-3">
                    {user?.role === "admin" && (
                      <div className="flex gap-2">
                        {editingId === test.test_id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdate(test.test_id)}
                              className="bg-green-500 text-white p-2 rounded">
                              <Save size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="bg-gray-500 text-white p-2 rounded">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(test)}
                              className="bg-blue-500 text-white p-2 rounded">
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(test.test_id)}
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

              {filteredTests.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-5">
                    No Exams Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
