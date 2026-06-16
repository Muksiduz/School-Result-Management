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

  const [formData, setFormData] = useState({
    name: "",
    class_id: "",
  });

  const [editData, setEditData] = useState({
    name: "",
    class_id: "",
  });

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createSubject({
        name: formData.name,
        class_id: Number(formData.class_id),
      });

      setFormData({
        name: "",
        class_id: "",
      });

      fetchSubjects();

      alert("Subject Created Successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed To Create Subject");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject.subject_id);

    setEditData({
      name: subject.name,
      class_id: subject.class_id,
    });
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
      console.log(error);

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
      console.log(error);

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

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen size={28} />
            Subject Management
          </h1>

          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
            Total: {filteredSubjects.length}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Subject Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <select
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required>
            <option value="">Select Class</option>

            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
            <Plus size={18} />

            {loading ? "Creating..." : "Add Subject"}
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3.5" />

            <input
              type="text"
              placeholder="Search Subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border p-3 rounded-lg">
            <option value="">All Classes</option>

            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">ID</th>

                <th className="border p-3">Subject Name</th>

                <th className="border p-3">Class</th>

                <th className="border p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td className="border p-3">{subject.subject_id}</td>

                  <td className="border p-3">
                    {editingId === subject.subject_id ? (
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
                      subject.name
                    )}
                  </td>

                  <td className="border p-3">
                    {editingId === subject.subject_id ? (
                      <select
                        value={editData.class_id}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            class_id: e.target.value,
                          })
                        }
                        className="border p-2 rounded">
                        {classes.map((cls) => (
                          <option key={cls.class_id} value={cls.class_id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      classes.find((c) => c.class_id === subject.class_id)
                        ?.name || "-"
                    )}
                  </td>

                  <td className="border p-3">
                    {user?.role === "admin" && (
                      <div className="flex gap-2">
                        {editingId === subject.subject_id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdate(subject.subject_id)}
                              className="bg-green-500 text-white p-2 rounded">
                              <Save size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                              }}
                              className="bg-gray-500 text-white p-2 rounded">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(subject)}
                              className="bg-blue-500 text-white p-2 rounded">
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(subject.subject_id)}
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

              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-5">
                    No Subjects Found
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

export default SubjectsPage;
