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
  ArrowUpRight,
  ChevronDown,
  ArrowUpCircle,
} from "lucide-react";
import { Eye } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getSectionsByClass } from "../../services/sectionService";

import AddStudent from "./AddStudentPage";
import usePromoteStore from "../../store/PromoteStore";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [promoteButtonClick, setPromoteButtonClick] = useState(null);
  const [editSections, setEditSections] = useState([]);

  const [viewStudent, setViewStudent] = useState(null);

  const user = useAuthStore((state) => state.user);

  const [promoteStudent, setPromoteStudent] = useState(null);
  const [promoteData, setPromoteData] = useState({
    class_id: "",
    section_id: "",
  });

  const {
    classes: pclasses,
    sections,
    selectedClass: selectedCls,
    selectedSection: selectedSec,
    initialfetch,
    setSelectedClass: setSelectedcls,
    setSelectedSection,
    promoteStd,
  } = usePromoteStore();

  useEffect(() => {
    initialfetch();
    console.log("Class:", pclasses);
  }, []);

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

  const handleEdit = async (student) => {
    try {
      if (student.class_id) {
        const data = await getSectionsByClass(student.class_id);
        setEditSections(data);
      }

      setEditData({
        student_id: student.student_id,
        name: student.name || "",
        roll_no: student.roll_no || "",
        class_id: student.class_id || "",
        section_id: student.section_id || "",
        gender: student.gender || "",
        father_name: student.father_name || "",
        mother_name: student.mother_name || "",
        phone: student.phone || "",
        date_of_birth: student.date_of_birth?.split("T")[0] || "",
        address: student.address || "",
      });

      setEditModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async () => {
    try {
      await updateStudent(editData.student_id, editData);

      fetchStudents();

      setEditModal(false);

      alert("Student Updated Successfully");
    } catch (error) {
      console.log(error);
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
        <div className="overflow-visible">
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
                  Section
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
                      <span className="font-medium text-gray-700">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  {/* Roll */}
                  <td className="px-4 py-3">
                    <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">
                      #{student.roll_no}
                    </span>
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
                  {/* Section */}
                  <td className="px-4 py-3">
                    <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">
                      {student.section_name}
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
                    <span className="text-gray-600">{student.phone}</span>
                  </td>

                  {/* Actions */}
                  {user?.role === "admin" && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <>
                          <button
                            onClick={() => setViewStudent(student)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 transition-colors">
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setPromoteStudent(student);
                              setPromoteData({ class_id: "", section_id: "" });
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 transition-colors"
                            title="Promote Student">
                            <ArrowUpCircle size={14} />
                          </button>
                        </>
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
      {viewStudent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewStudent(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {viewStudent.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {viewStudent.name}
                  </h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Student Profile
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewStudent(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1">
              {/* Basic Info */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Basic Information
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Roll Number", value: `#${viewStudent.roll_no}` },
                  { label: "Class", value: viewStudent.class_name },
                  { label: "Section", value: viewStudent.section_name },
                  { label: "Gender", value: viewStudent.gender },
                  {
                    label: "Date of Birth",
                    value: viewStudent.date_of_birth?.split("T")[0],
                  },
                  { label: "Phone", value: viewStudent.phone },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {item.value || "—"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Guardian Info */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Guardian Details
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Father's Name", value: viewStudent.father_name },
                  { label: "Mother's Name", value: viewStudent.mother_name },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {item.value || "—"}
                    </p>
                  </div>
                ))}
                <div className="col-span-2 bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1">Address</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {viewStudent.address || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1">Created By</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {viewStudent.created_by || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setViewStudent(null)}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Student
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Update the student's information
                </p>
              </div>
              <button
                onClick={() => setEditModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Basic Information
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Student Name *
                  </label>
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    placeholder="Full name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Roll Number
                  </label>
                  <input
                    value={editData.roll_no}
                    onChange={(e) =>
                      setEditData({ ...editData, roll_no: e.target.value })
                    }
                    placeholder="e.g. 01"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Class
                  </label>
                  <select
                    value={editData.class_id}
                    onChange={async (e) => {
                      const classId = e.target.value;

                      setEditData({
                        ...editData,
                        class_id: classId,
                        section_id: "",
                      });

                      try {
                        const data = await getSectionsByClass(classId);
                        setEditSections(data);
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all">
                    <option value="">Select class</option>

                    {classes?.map((cls) => (
                      <option key={cls.class_id} value={cls.class_id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Section
                  </label>
                  <select
                    value={editData.section_id || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        section_id: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all">
                    <option value="">Select section</option>

                    {editSections?.map((sec) => (
                      <option
                        key={sec.section_id}
                        value={String(sec.section_id)}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editData.date_of_birth}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        date_of_birth: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={editData.gender}
                    onChange={(e) =>
                      setEditData({ ...editData, gender: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    placeholder="+91 00000 00000"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Guardian Details
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Father's Name
                  </label>
                  <input
                    value={editData.father_name}
                    onChange={(e) =>
                      setEditData({ ...editData, father_name: e.target.value })
                    }
                    placeholder="Father's full name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Mother's Name
                  </label>
                  <input
                    value={editData.mother_name}
                    onChange={(e) =>
                      setEditData({ ...editData, mother_name: e.target.value })
                    }
                    placeholder="Mother's full name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Address
                  </label>
                  <textarea
                    value={editData.address}
                    onChange={(e) =>
                      setEditData({ ...editData, address: e.target.value })
                    }
                    placeholder="Full residential address"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all min-h-20 resize-none"
                  />
                </div>
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
      {/* modal for the promotion change it  */}
      {promoteStudent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPromoteStudent(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Promote Student
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Move student to the next class
                </p>
              </div>
              <button
                onClick={() => setPromoteStudent(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Student info pill */}
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {promoteStudent.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {promoteStudent.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Currently in{" "}
                    <span className="text-purple-600 font-medium">
                      {promoteStudent.class_name}
                    </span>{" "}
                    —{" "}
                    <span className="text-purple-600 font-medium">
                      {promoteStudent.section_name}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Promote To
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    New Class *
                  </label>
                  <select
                    value={promoteData.class_id}
                    onChange={(e) =>
                      setPromoteData({
                        ...promoteData,
                        class_id: e.target.value,
                        section_id: "",
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all">
                    <option value="">Select class</option>
                    {classes?.map((cls) => (
                      <option key={cls.class_id} value={cls.class_id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    New Section *
                  </label>
                  <select
                    value={promoteData.section_id}
                    onChange={(e) =>
                      setPromoteData({
                        ...promoteData,
                        section_id: e.target.value,
                      })
                    }
                    disabled={!promoteData.class_id}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="">Select section</option>
                    {sections?.map((sec) => (
                      <option key={sec.section_id} value={sec.section_id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Arrow indicator */}
              {promoteData.class_id && (
                <div className="mt-4 flex items-center justify-center gap-3 text-sm">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium">
                    {promoteStudent.class_name}
                  </span>
                  <ArrowUpCircle size={18} className="text-purple-400" />
                  <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium">
                    {
                      classes?.find(
                        (c) =>
                          String(c.class_id) === String(promoteData.class_id),
                      )?.name
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setPromoteStudent(null)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                disabled={!promoteData.class_id || !promoteData.section_id}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors">
                <ArrowUpCircle size={15} />
                Promote Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsPage;
