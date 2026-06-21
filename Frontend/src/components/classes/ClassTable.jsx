import { useEffect, useState } from "react";
import { Pencil, Trash2, School, X, Save } from "lucide-react";
import {
  getAllClasses,
  updateClass,
  deleteClass,
} from "../../services/classService";
import ClassForm from "./ClassForm";

import { useAuthStore } from "../../store/authStore";

function ClassTable() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [name, setName] = useState("");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();
      setClasses(data.classes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await deleteClass(id);
      fetchClasses();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const handleEdit = (classItem) => {
    setSelectedClass(classItem);
    setName(classItem.name);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await updateClass(selectedClass.id, { name });
      setEditModal(false);
      fetchClasses();
    } catch (error) {
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Home / Classes</p>
          <h1 className="text-2xl font-semibold text-gray-800">Classes</h1>
        </div>
        {user.role === "admin" && (
          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <School size={16} />
            Add Class
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700">All Classes</h2>
          <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg">
            Total: {classes.length}
          </span>
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
                  Class Name
                </th>
                {user.role === "admin" && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <tr
                    key={classItem.class_id}
                    className="border-b border-gray-50 hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-3">
                      <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-md">
                        #{classItem.class_id}
                      </span>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                          <School size={14} />
                        </div>
                        <span className="font-medium text-gray-700">
                          {classItem.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      {user.role === "admin" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(classItem)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(classItem.class_id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    <School size={36} className="mx-auto mb-2 opacity-30" />
                    No classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Update Class
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Edit the class name below
                </p>
              </div>
              <button
                onClick={() => setEditModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Class Details
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div>
                <label className={labelClass}>Class Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
                <Save size={15} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {addModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col">
            <ClassForm
              onClose={() => setAddModal(false)}
              onSuccess={fetchClasses}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassTable;
