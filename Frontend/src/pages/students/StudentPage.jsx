import { useEffect, useState } from "react";

import {
  getAllStudents,
  deleteStudent,
  updateStudent,
} from "../../services/studentService";

import { getAllClasses } from "../../services/classService";

import { Search, Trash2, Users, Pencil, Save, X } from "lucide-react";

import { useAuthStore } from "../../store/authStore";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const user = useAuthStore((state) => state.user);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users size={28} />
            Students
          </h1>

          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
            Total: {filteredStudents.length}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3.5" />

            <input
              type="text"
              placeholder="Search Student..."
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

            {classes?.map((cls) => (
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
                <th className="border p-3">Roll No</th>

                <th className="border p-3">Name</th>

                <th className="border p-3">Class</th>

                <th className="border p-3">Section</th>

                <th className="border p-3">Father</th>

                <th className="border p-3">Phone</th>

                <th className="border p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td className="border p-3">
                    {editingId === student.student_id ? (
                      <input
                        value={editData.roll_no || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            roll_no: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    ) : (
                      student.roll_no
                    )}
                  </td>

                  <td className="border p-3">
                    {editingId === student.student_id ? (
                      <input
                        value={editData.name || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            name: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    ) : (
                      student.name
                    )}
                  </td>

                  <td className="border p-3">{student.class_name}</td>

                  <td className="border p-3">{student.section_name}</td>

                  <td className="border p-3">
                    {editingId === student.student_id ? (
                      <input
                        value={editData.father_name || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            father_name: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    ) : (
                      student.father_name
                    )}
                  </td>

                  <td className="border p-3">
                    {editingId === student.student_id ? (
                      <input
                        value={editData.phone || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            phone: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    ) : (
                      student.phone
                    )}
                  </td>

                  <td className="border p-3">
                    {user?.role === "admin" && (
                      <div className="flex gap-2">
                        {editingId === student.student_id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(student.student_id)}
                              className="bg-green-500 text-white p-2 rounded">
                              <Save size={16} />
                            </button>

                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditData({});
                              }}
                              className="bg-gray-500 text-white p-2 rounded">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(student)}
                              className="bg-blue-500 text-white p-2 rounded">
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => handleDelete(student.student_id)}
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

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-5">
                    No Students Found
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

export default StudentsPage;
