import { useEffect, useState } from "react";
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
} from "../../services/studentService";
import { getAllClasses } from "../../services/classService";
import {
  Search,
  Trash2,
  Users,
  Pencil,
  Save,
  X,
  Plus,
  UserPlus,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

import AddStudent from "./AddStudentPage";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const user = useAuthStore((state) => state.user);

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();
      setClasses(data.classes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Student?")) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.student_id);
    setEditData({
      name: student.name,
      roll_no: student.roll_no,
      class_id: student.class_id,
      section_id: student.section_id,
      father_name: student.father_name,
      mother_name: student.mother_name,
      phone: student.phone,
      date_of_birth: student.date_of_birth,
      address: student.address,
    });
  };

  const handleUpdate = async (studentId) => {
    try {
      await updateStudent(studentId, editData);
      setEditingId(null);
      setEditData({});
      fetchStudents();
      alert("Student Updated Successfully");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed To Update Student");
    }
  };

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      student.name?.toLowerCase().includes(search) ||
      student.roll_no?.toString().includes(search) ||
      student.father_name?.toLowerCase().includes(search);
    const matchesClass =
      !selectedClass || String(student.class_id) === String(selectedClass);
    return matchesSearch && matchesClass;
  });

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-gray-400 mb-1">Home / Students</p>
          <h1 className="text-2xl font-semibold text-gray-800">
            Students List
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} />
          Add Students
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100 mt-6">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gray-700">
            Students Information
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or roll"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-56"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
              <option value="">All Classes</option>
              {classes?.map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.name}
                </option>
              ))}
            </select>

            {/* Count Badge */}
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              Total: {filteredStudents.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Students Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Roll
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Date of Birth
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Phone
                </th>
                {user?.role === "admin" && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.student_id}
                  className="border-b border-gray-50 hover:bg-purple-50/40 transition-colors">
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {getInitials(student.name)}
                      </div>
                      {editingId === student.student_id ? (
                        <input
                          value={editData.name || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                        />
                      ) : (
                        <span className="font-medium text-gray-700">
                          {student.name}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Roll */}
                  <td className="px-4 py-3">
                    {editingId === student.student_id ? (
                      <input
                        value={editData.roll_no || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, roll_no: e.target.value })
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-20 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      />
                    ) : (
                      <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        #{student.roll_no}
                      </span>
                    )}
                  </td>

                  {/* Address */}
                  <td className="px-4 py-3 text-gray-500">
                    {student.address || "—"}
                  </td>

                  {/* Class */}
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md">
                      {student.class_name}
                    </span>
                  </td>

                  {/* DOB */}
                  <td className="px-4 py-3 text-gray-500">
                    {student.date_of_birth
                      ? new Date(student.date_of_birth).toLocaleDateString(
                          "en-GB",
                        )
                      : "—"}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3">
                    {editingId === student.student_id ? (
                      <input
                        value={editData.phone || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-32 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      />
                    ) : (
                      <span className="text-gray-600">{student.phone}</span>
                    )}
                  </td>

                  {/* Actions */}
                  {user?.role === "admin" && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {editingId === student.student_id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(student.student_id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 transition-colors">
                              <Save size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditData({});
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-100 transition-colors">
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(student)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 transition-colors">
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(student.student_id)}
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

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <Users size={36} className="mx-auto mb-2 opacity-30" />
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAddModal(false)
          }>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <AddStudent
              onClose={() => {
                setShowAddModal(false);
                fetchStudents();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsPage;
