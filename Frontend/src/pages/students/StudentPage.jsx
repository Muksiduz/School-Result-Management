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
  FileText,
  GraduationCap,
  Download,
} from "lucide-react";
import { Eye } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getSectionsByClass } from "../../services/sectionService";

import AddStudent from "./AddStudentPage";
import usePromoteStore from "../../store/PromoteStore";
import jsPDF from "jspdf";

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
  // console.log("promoteData:", promoteStudent, typeof promoteStudent);

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
    // console.log("Class:", pclasses);
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

  const generateCertificate = (student) => {
    const doc = new jsPDF();

    const today = new Date().toLocaleDateString("en-GB");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("YOUR SCHOOL NAME", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("School Address, City, State", 105, 28, {
      align: "center",
    });

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("STUDENT CERTIFICATE", 105, 50, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Certificate No : SC-${Date.now()}`, 20, 68);
    doc.text(`Date : ${today}`, 150, 68);

    doc.text("This is to certify that", 20, 88);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);

    doc.text(student.name.toUpperCase(), 105, 102, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(
      `S/o / D/o : ${student.father_name || "_____________________"}`,
      20,
      118,
    );

    doc.text(
      `Mother's Name : ${student.mother_name || "_____________________"}`,
      20,
      130,
    );

    doc.text(`Roll Number : ${student.roll_no}`, 20, 142);

    doc.text(`Class : ${student.class_name}`, 20, 154);

    doc.text(`Section : ${student.section_name}`, 110, 154);

    doc.text(`Gender : ${student.gender}`, 20, 166);

    doc.text(
      `Date of Birth : ${
        student.date_of_birth
          ? new Date(student.date_of_birth).toLocaleDateString("en-GB")
          : "-"
      }`,
      110,
      166,
    );

    doc.text("Address :", 20, 182);

    doc.text(student.address || "-", 20, 192, {
      maxWidth: 165,
    });

    doc.text("This student is a bonafide student of this institution", 20, 220);

    doc.text(
      "and is currently enrolled in the above mentioned class.",
      20,
      230,
    );

    doc.line(120, 265, 180, 265);

    doc.text("Principal", 145, 272);

    doc.save(`${student.name}-Student-Certificate.pdf`);
  };
  const generatePassCertificate = (student) => {
    const doc = new jsPDF();

    const today = new Date().toLocaleDateString("en-GB");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text("YOUR SCHOOL NAME", 105, 20, {
      align: "center",
    });

    doc.setFontSize(18);

    doc.text("PASS CERTIFICATE", 105, 32, {
      align: "center",
    });

    doc.setLineWidth(0.5);

    doc.line(20, 38, 190, 38);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Certificate No : PC-${Date.now()}`, 20, 50);

    doc.text(`Date : ${today}`, 150, 50);

    doc.setFont("helvetica", "normal");

    doc.text("This is to certify that", 20, 68);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(18);

    doc.text(student.name.toUpperCase(), 105, 82, {
      align: "center",
    });

    doc.setFontSize(12);

    doc.setFont("helvetica", "normal");

    doc.text(`Son / Daughter of ${student.father_name}`, 20, 98);

    doc.text("has successfully passed the Annual Examination.", 20, 112);

    doc.text(
      `Previous Class : ${student.class_name} - ${student.section_name}`,
      20,
      128,
    );

    doc.text(
      `Promoted To : ${selectedCls?.name || ""} - ${selectedSec?.name || ""}`,
      20,
      142,
    );

    doc.text(`Roll Number : ${student.roll_no}`, 20, 156);

    doc.text("The student has fulfilled all academic", 20, 176);

    doc.text("requirements and is promoted to the next class.", 20, 186);

    doc.text("We wish the student every success in future.", 20, 202);

    doc.line(120, 245, 180, 245);

    doc.text("Principal", 140, 252);

    doc.save(`${student.name}-Pass-Certificate.pdf`);
  };

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
        {user.role === "admin" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus size={16} />
            Add Students
          </button>
        )}
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
                  Student ID
                </th>
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
                  <td className="px-4 py-3">
                    <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">
                      #{student.student_id}
                    </span>
                  </td>
                  {/* Name */}
                  <td className="px-4 py-3 min-w-[180px] max-w-[220px]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {getInitials(student.name)}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="font-medium text-gray-700 truncate"
                          title={student.name}>
                          {student.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Roll */}
                  <td className="px-4 py-3">
                    <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">
                      #{student.roll_no}
                    </span>
                  </td>

                  {/* Address */}
                  <td className="px-4 py-3 max-w-[220px]">
                    <div
                      className="text-gray-500 line-clamp-2"
                      title={student.address}>
                      {student.address || "—"}
                    </div>
                  </td>
                  {/* Class */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                      {student.class_name}
                    </span>
                  </td>
                  {/* Section */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                      {student.section_name}
                    </span>
                  </td>

                  {/* DOB */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-sm">
                    {student.date_of_birth
                      ? new Date(student.date_of_birth).toLocaleDateString(
                          "en-GB",
                        )
                      : "—"}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-sm">
                    {student.phone || "—"}
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
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold shrink-0">
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

            {/* Promote student code*/}
            <div className="px-6 py-5">
              {/* Student info pill */}
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold shrink-0">
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
                    value={selectedCls?.class_id || ""}
                    onChange={(e) => {
                      const c = pclasses.find(
                        (cls) => cls.class_id === Number(e.target.value),
                      );
                      setSelectedcls(c);
                      // console.log("selected class", selectedCls);
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all">
                    <option value="">Select class</option>
                    {pclasses.map((cls) => (
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
                    value={selectedSec?.section_id || ""}
                    onChange={(e) => {
                      const s = sections.find(
                        (sec) => sec.section_id === Number(e.target.value),
                      );
                      setSelectedSection(s);
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="">Select section</option>
                    {sections?.map((sec) => (
                      <option key={sec.section_id} value={sec.section_id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Roll Number
                  </label>
                  <input
                    value={promoteStudent.roll_no}
                    onChange={(e) => {
                      setPromoteStudent({
                        ...promoteStudent,
                        roll_no: e.target.value,
                      });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>
              {/* ---------------- Documents ---------------- */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Documents
                  </span>
                  <div className="flex-1 h-px bg-purple-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Export Certificate */}
                  <button
                    onClick={() => generateCertificate(promoteStudent)}
                    className="
        flex items-center justify-between
        rounded-2xl border border-purple-100
        bg-purple-50
        px-5 py-4
        hover:bg-purple-100
        hover:border-purple-300
        transition-all
        group
      ">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <FileText
                          size={20}
                          className="text-purple-600 group-hover:scale-110 transition"
                        />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">
                          Export Certificate
                        </p>

                        <p className="text-xs text-gray-500">
                          Student profile certificate
                        </p>
                      </div>
                    </div>

                    <Download size={18} className="text-purple-500" />
                  </button>

                  {/* Export Pass Certificate */}
                  <button
                    onClick={() => generatePassCertificate(promoteStudent)}
                    className="
        flex items-center justify-between
        rounded-2xl border border-emerald-100
        bg-emerald-50
        px-5 py-4
        hover:bg-emerald-100
        hover:border-emerald-300
        transition-all
        group
      ">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <GraduationCap
                          size={20}
                          className="text-emerald-600 group-hover:scale-110 transition"
                        />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">
                          Export Pass Certificate
                        </p>

                        <p className="text-xs text-gray-500">
                          Promotion / pass certificate
                        </p>
                      </div>
                    </div>

                    <Download size={18} className="text-emerald-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setPromoteStudent(null)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  promoteStd(promoteStudent, promoteStudent.roll_no);
                  setPromoteStudent(null);
                  fetchStudents();
                }}
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
