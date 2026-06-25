import { useEffect, useState } from "react";
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../services/subjectService";
import { getAllClasses } from "../../services/classService";
import { useAuthStore } from "../../store/authStore";
import { BookOpen, Plus, Search, Pencil, Trash2, Save, X } from "lucide-react";

function SubjectsPage() {
  const user = useAuthStore((state) => state.user);

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({ name: "", class_id: "" });
  const [editData, setEditData] = useState({ name: "", class_id: "" });

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();
      setClasses(data.classes || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createSubject({
        name: formData.name,
        class_id: Number(formData.class_id),
      });
      setFormData({ name: "", class_id: "" });
      fetchSubjects();
      setShowForm(false);
      alert("Subject Created Successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed To Create Subject");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject.subject_id);
    setEditData({ name: subject.name, class_id: subject.class_id });
  };

  const handleUpdate = async (id) => {
    try {
      await updateSubject(id, {
        name: editData.name,
        class_id: Number(editData.class_id),
      });
      setEditingId(null);
      fetchSubjects();
      alert("Subject Updated Successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed To Update Subject");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Subject?")) return;
    try {
      await deleteSubject(id);
      fetchSubjects();
      alert("Subject Deleted Successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed To Delete Subject");
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch = subject.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass =
      !selectedClass || String(subject.class_id) === String(selectedClass);
    return matchesSearch && matchesClass;
  });

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Home / Subjects</p>
          <h1 className="text-2xl font-semibold text-gray-800">
            Subject Management
          </h1>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus size={16} />
            Add Subject
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gray-700">
            Subjects Information
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-48"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              Total: {filteredSubjects.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Subject Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Class
                </th>
                {user?.role === "admin" && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr
                  key={subject.subject_id}
                  className="border-b border-gray-50 hover:bg-purple-50/40 transition-colors">
                  <td className="px-6 py-3">
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-md">
                      #{subject.subject_id}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={14} />
                      </div>
                      {editingId === subject.subject_id ? (
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                        />
                      ) : (
                        <span className="font-medium text-gray-700">
                          {subject.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {editingId === subject.subject_id ? (
                      <select
                        value={editData.class_id}
                        onChange={(e) =>
                          setEditData({ ...editData, class_id: e.target.value })
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                        {classes.map((cls) => (
                          <option key={cls.class_id} value={cls.class_id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        {classes.find((c) => c.class_id === subject.class_id)
                          ?.name || "—"}
                      </span>
                    )}
                  </td>
                  {user?.role === "admin" && (
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {editingId === subject.subject_id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdate(subject.subject_id)}
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
                              onClick={() => handleEdit(subject)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 transition-colors">
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(subject.subject_id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    <BookOpen size={36} className="mx-auto mb-2 opacity-30" />
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Subject
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Create a new subject record
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form
              id="subjectForm"
              onSubmit={handleSubmit}
              className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Subject Details
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div>
                <label className={labelClass}>Subject Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Mathematics"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Class *</label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  className={inputClass}
                  required>
                  <option value="">Select class</option>
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
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
                form="subjectForm"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                <Plus size={15} />
                {loading ? "Creating..." : "Add Subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectsPage;
