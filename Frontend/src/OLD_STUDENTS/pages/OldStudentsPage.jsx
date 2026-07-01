import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Pencil,
  Save,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Calendar,
  Eye,
  FileBadge,
} from "lucide-react";
import { useOldStudentsStore } from "../store/oldStuduntsStore";
import { updateOldStudents, deleteOldStudents } from "../utils/oldStudentsApi";
import jsPDF from "jspdf";
import logoS from "../../../public/logoS.jpg";

const PAGE_SIZE = 10;

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const EMPTY_FORM = {
  name: "",
  roll_no: "",
  old_session_id: "",
  class_name: "",
  section: "",

  gender: "",
  date_of_birth: "",
  phone: "",
  address: "",

  father_name: "",
  mother_name: "",

  religion: "",
  nationality: "",
  date_of_joining: "",
  date_of_leaving: "",
  final_examination_held: "",
};

const OldStudentsPage = () => {
  const {
    oldStudents,
    oldSession,
    selectedSession,
    loading,
    error,
    initialFetch,
    setSelectedSession,
    createOldStudents,
  } = useOldStudentsStore();

  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    initialFetch();
  }, []);

  const resetForm = () => setFormData(EMPTY_FORM);

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedStudent(null);
    resetForm();
  };

  // ── Filtering + Pagination ──
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return oldStudents.filter((s) => {
      const matchSearch =
        !term ||
        s.name?.toLowerCase().includes(term) ||
        s.roll_no?.toString().includes(term) ||
        s.class_name?.toLowerCase().includes(term) ||
        s.father_name?.toLowerCase().includes(term);
      const matchGender = !filterGender || s.gender === filterGender;
      return matchSearch && matchGender;
    });
  }, [oldStudents, search, filterGender]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, filterGender, selectedSession]);

  // ── Stats ──
  const maleCount = oldStudents.filter((s) => s.gender === "Male").length;
  const femaleCount = oldStudents.filter((s) => s.gender === "Female").length;

  const hasActiveFilters = search || filterGender;

  // ── CRUD ──
  const handleCreate = async () => {
    if (!formData.name?.trim() || !formData.old_session_id) {
      return alert("Name and Session are required");
    }
    setSubmitting(true);
    try {
      console.log("formData", formData);
      await createOldStudents({
        ...formData,
        old_session_id: Number(formData.old_session_id),
      });
      resetForm();
      setShowAddModal(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (student) => {
    console.log("student", student);
    setSelectedStudent(student);
    setFormData({
      name: student.name || "",
      roll_no: student.roll_no || "",
      old_session_id: student.old_session_id || "",
      class_name: student.class_name || "",
      section: student.section || "",

      gender: student.gender || "",
      date_of_birth: student.date_of_birth?.split("T")[0] || "",
      phone: student.phone || "",
      address: student.address || "",

      father_name: student.father_name || "",
      mother_name: student.mother_name || "",

      religion: student.religion || "",
      nationality: student.nationality || "",
      date_of_joining: student.date_of_joining?.split("T")[0] || "",
      date_of_leaving: student.date_of_leaving?.split("T")[0] || "",
      final_examination_held: student.final_examination_held || "",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await updateOldStudents(selectedStudent.old_student_id, {
        ...formData,
        old_session_id: Number(formData.old_session_id),
      });
      await initialFetch();
      setShowEditModal(false);
      setSelectedStudent(null);
      resetForm();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteOldStudents(id);
      await initialFetch();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  // ── Certificate PDF ──

  const generateCertificate = (student) => {
    // console.log(student);
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("en-GB");
    const pageWidth = 210;

    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);

    // ===== OUTER DECORATIVE BORDER =====
    doc.setLineWidth(1.2);
    doc.rect(8, 8, 194, 281);
    doc.setLineWidth(0.4);
    doc.rect(11, 11, 188, 275);

    // ===== HEADER: SCHOOL NAME =====
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("TARANGAJHAR HIGH SCHOOL", pageWidth / 2, 28, { align: "center" });

    doc.setLineWidth(0.4);
    doc.line(45, 32, 165, 32);

    // ===== EMBLEM (logoS.png — Satyameva Jayate / Ashoka emblem) =====
    // x=90, y=36, width=30, height=26 — adjust if logoS.png's aspect ratio differs
    doc.addImage(logoS, "PNG", 90, 36, 30, 26);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("GOVERNMENT OF ASSAM", pageWidth / 2, 70, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text("Tarangajhar, Goalpara, Assam", pageWidth / 2, 78, {
      align: "center",
    });

    // ===== TITLE BAND =====
    doc.setLineWidth(0.4);
    doc.line(30, 86, 180, 86);

    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setFontSize(17);
    doc.text("SCHOOL LEAVING CERTIFICATE", 105, 95, { align: "center" });

    doc.setFontSize(13);
    doc.line(30, 100, 180, 100);

    // ===== BODY =====
    doc.setFont("times", "normal");
    doc.setFontSize(11.5);
    let y = 114;
    const lh = 8;

    doc.setFont("times", "normal");
    doc.text("This is to certify that Sri/Smt.", 30, y);

    doc.setFont("times", "bold");
    doc.text(
      (student.name || "................................").toUpperCase(),
      88,
      y,
    );
    y += lh;

    doc.setFont("times", "normal");
    doc.text("Son / Daughter of", 30, y);

    doc.setFont("times", "bold");
    doc.text(
      (
        student.father_name || "......................................."
      ).toUpperCase(),
      70,
      y,
    );
    y += lh;

    doc.setFont("times", "normal");
    doc.text("Date of Birth", 30, y);

    doc.setFont("times", "bold");
    doc.text(
      (student.date_of_birth
        ? new Date(student.date_of_birth).toLocaleDateString("en-GB")
        : "____________"
      ).toUpperCase(),
      62,
      y,
    );
    y += lh;

    doc.setFont("times", "normal");
    doc.text("Nationality", 30, y);

    doc.setFont("times", "bold");
    doc.text((student.nationality || "INDIAN").toUpperCase(), 56, y);
    doc.setFont("times", "normal");
    doc.text("Religion", 120, y);

    doc.setFont("times", "bold");
    doc.text(
      (student.religion || ".......................").toUpperCase(),
      140,
      y,
    );
    y += lh;

    doc.setFont("times", "normal");
    doc.text("Address :", 30, y);

    doc.setFont("times", "bold");
    doc.text(
      (
        student.address ||
        "....................................................................................................."
      ).toUpperCase(),
      50,
      y,
      {
        maxWidth: 130,
      },
    );

    y += lh + 3;

    doc.setFont("times", "normal");
    doc.text("Was a bonafide student of this school from", 30, y);

    doc.setFont("times", "bold");
    doc.text(
      (student.date_of_joining
        ? new Date(student.date_of_joining).toLocaleDateString("en-GB")
        : "................."
      ).toUpperCase(),
      108,
      y,
    );

    doc.setFont("times", "normal");
    doc.text("to", 135, y);

    doc.setFont("times", "bold");
    doc.text(
      (student.date_of_leaving
        ? new Date(student.date_of_leaving).toLocaleDateString("en-GB")
        : "................."
      ).toUpperCase(),
      142,
      y,
    );
    y += lh + 2;

    doc.setFont("times", "normal");
    doc.text("Class", 30, y);

    doc.setFont("times", "bold");
    doc.text((student.class_name || "").toUpperCase(), 45, y);
    doc.setFont("times", "normal");
    doc.text("Section", 80, y);

    doc.setFont("times", "bold");
    doc.text((student.section || "").toUpperCase(), 98, y);
    doc.setFont("times", "normal");
    doc.text("Roll No.", 140, y);

    doc.setFont("times", "bold");
    doc.text(String(student.roll_no || "").toUpperCase(), 160, y);
    y += lh + 3;

    doc.text(
      "He/She has completed the course of study prescribed for the class in which",
      30,
      y,
    );
    y += lh - 2;
    doc.text(
      "he/she was studying and has passed/failed in the final examination",
      30,
      y,
    );
    y += lh - 2;
    doc.setFont("times", "normal");
    doc.text("Held in the year", 30, y);

    doc.setFont("times", "bold");
    doc.text(String(student.final_examination_held).toUpperCase(), 66, y);
    y += lh + 2;

    doc.text(
      "He/She is hereby relieved from the rolls of the school on his/her own request.",
      30,
      y,
    );
    y += lh + 2;

    doc.setFont("times", "normal");
    doc.text("Date of Leaving", 30, y);

    doc.setFont("times", "bold");
    doc.text(
      (student.date_of_leaving
        ? new Date(student.date_of_joining).toLocaleDateString("en-GB")
        : "................."
      ).toUpperCase(),
      68,
      y,
    );
    y += lh + 6;

    // ===== CHARACTER AND CONDUCT BOX =====
    doc.setLineWidth(0.4);
    doc.roundedRect(20, y, 170, 24, 2, 2);

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("CHARACTER AND CONDUCT", pageWidth / 2, y + 7, {
      align: "center",
    });

    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(
      `His/Her general character and conduct ${student.character || ".................................................................................................."}`,
      25,
      y + 17,
    );

    y += 26;

    // ===== SIGNATURE (bottom-right) =====
    doc.setLineWidth(0.4);
    doc.line(135, y + 10, 192, y + 10);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("Principal / Headmaster", 163, y + 16, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    doc.text("Tarangajhar High School", 163, y + 21, { align: "center" });

    doc.save(`${student.name || "Student"}-Leaving-Certificate.pdf`);
  };
  // ── Shared form JSX ──
  const renderForm = (onSubmit, submitLabel) => (
    <>
      <div className="overflow-y-auto flex-1 px-6 py-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Basic Information
          </span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className={labelClass}>Student Name *</label>
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Roll Number</label>
            <input
              type="text"
              placeholder="e.g. 01"
              value={formData.roll_no}
              onChange={(e) =>
                setFormData({ ...formData, roll_no: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Session *</label>
            <select
              value={formData.old_session_id}
              onChange={(e) =>
                setFormData({ ...formData, old_session_id: e.target.value })
              }
              className={inputClass}>
              <option value="">Select session</option>
              {oldSession?.map((s) => (
                <option key={s.old_session_id} value={s.old_session_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Class</label>
            <input
              type="text"
              placeholder="e.g. Class VII"
              value={formData.class_name}
              onChange={(e) =>
                setFormData({ ...formData, class_name: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Section</label>
            <input
              type="text"
              placeholder="e.g. A"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className={inputClass}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              placeholder="+91 00000 00000"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={inputClass}
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
            <label className={labelClass}>Father's Name</label>
            <input
              type="text"
              placeholder="Father's full name"
              value={formData.father_name}
              onChange={(e) =>
                setFormData({ ...formData, father_name: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Mother's Name</label>
            <input
              type="text"
              placeholder="Mother's full name"
              value={formData.mother_name}
              onChange={(e) =>
                setFormData({ ...formData, mother_name: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Address</label>
            <textarea
              placeholder="Full residential address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className={`${inputClass} min-h-[72px] resize-none`}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 mb-4">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Academic Information
          </span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Religion</label>
            <input
              type="text"
              value={formData.religion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  religion: e.target.value,
                })
              }
              className={inputClass}
              placeholder="Religion"
            />
          </div>

          <div>
            <label className={labelClass}>Nationality</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nationality: e.target.value,
                })
              }
              className={inputClass}
              placeholder="Nationality"
            />
          </div>

          <div>
            <label className={labelClass}>Date of Joining</label>
            <input
              type="date"
              value={formData.date_of_joining}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date_of_joining: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Date of Leaving</label>
            <input
              type="date"
              value={formData.date_of_leaving}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date_of_leaving: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          <div className="col-span-2">
            <label className={labelClass}>Final Examination Held</label>
            <input
              type="text"
              value={formData.final_examination_held}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  final_examination_held: e.target.value,
                })
              }
              className={inputClass}
              placeholder="HSLC 2025 / Annual Examination 2025"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={closeModals}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
          <Save size={15} />
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </>
  );

  // ── View modal JSX ──
  const renderViewModal = () => {
    if (!viewStudent) return null;
    const sessionName =
      oldSession?.find((s) => s.old_session_id === viewStudent.old_session_id)
        ?.name ||
      viewStudent.session_name ||
      "—";

    const InfoCard = ({ title, value }) => (
      <div className="bg-gray-50/80 rounded-xl px-4 py-3 border border-gray-100">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
          {title}
        </p>
        <p className="text-sm font-semibold text-gray-700">{value || "—"}</p>
      </div>
    );

    return (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && setViewStudent(null)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 px-6 py-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold ring-2 ring-white/30">
                {getInitials(viewStudent.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">
                  {viewStudent.name}
                </h2>
                <p className="text-purple-200 text-sm mt-0.5">
                  Roll #{viewStudent.roll_no || "—"} ·{" "}
                  {viewStudent.class_name || "—"} · Section{" "}
                  {viewStudent.section || "—"}
                </p>
              </div>
              <button
                onClick={() => setViewStudent(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Student Information
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoCard
                  title="Roll Number"
                  value={`#${viewStudent.roll_no}`}
                />
                <InfoCard title="Class" value={viewStudent.class_name} />
                <InfoCard title="Section" value={viewStudent.section} />
                <InfoCard title="Academic Session" value={sessionName} />
                <InfoCard title="Gender" value={viewStudent.gender} />
                <InfoCard
                  title="Date of Birth"
                  value={formatDate(viewStudent.date_of_birth)}
                />
                <InfoCard title="Phone" value={viewStudent.phone} />
                <InfoCard title="Religion" value={viewStudent.religion} />

                <InfoCard title="Nationality" value={viewStudent.nationality} />

                <InfoCard
                  title="Date of Joining"
                  value={formatDate(viewStudent.date_of_joining)}
                />

                <InfoCard
                  title="Date of Leaving"
                  value={formatDate(viewStudent.date_of_leaving)}
                />

                <InfoCard
                  title="Final Examination"
                  value={viewStudent.final_examination_held}
                />
                <div className="col-span-2 sm:col-span-3">
                  <InfoCard title="Address" value={viewStudent.address} />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Guardian Details
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  title="Father's Name"
                  value={viewStudent.father_name}
                />
                <InfoCard
                  title="Mother's Name"
                  value={viewStudent.mother_name}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  System Info
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoCard title="Created By" value={viewStudent.created_by} />
                <InfoCard
                  title="Created At"
                  value={formatDate(viewStudent.created_at)}
                />
                <InfoCard
                  title="Last Updated"
                  value={formatDate(viewStudent.updated_at)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => setViewStudent(null)}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Pagination JSX ──
  const renderPagination = () => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    return (
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
        <p className="text-xs text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-600">
            {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}
          </span>
          –
          <span className="font-semibold text-gray-600">
            {Math.min(page * PAGE_SIZE, filtered.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
          students
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-purple-50 hover:border-purple-300 transition-all">
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p =
              totalPages <= 5
                ? i + 1
                : page <= 3
                  ? i + 1
                  : page >= totalPages - 2
                    ? totalPages - 4 + i
                    : page - 2 + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-all ${
                  p === page
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-gray-200 hover:bg-purple-50 hover:border-purple-300 text-gray-600"
                }`}>
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-purple-50 hover:border-purple-300 transition-all">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="p-6 min-h-screen space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">Home / Old Students</p>
          <h1 className="text-2xl font-semibold text-gray-800">Old Students</h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} />
          Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: oldStudents.length,
            icon: Users,
            bg: "bg-purple-50",
            ic: "text-purple-500",
          },
          {
            label: "Male Students",
            value: maleCount,
            icon: UserCheck,
            bg: "bg-blue-50",
            ic: "text-blue-500",
          },
          {
            label: "Female Students",
            value: femaleCount,
            icon: UserX,
            bg: "bg-pink-50",
            ic: "text-pink-500",
          },
          {
            label: "Sessions",
            value: new Set(oldStudents.map((s) => s.old_session_id)).size,
            icon: Calendar,
            bg: "bg-indigo-50",
            ic: "text-indigo-500",
          },
        ].map(({ label, value, icon: Icon, bg, ic }) => (
          <div
            key={label}
            className="bg-white/70 rounded-2xl border border-purple-100 p-5 hover:shadow-md transition-shadow">
            <div
              className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={ic} />
            </div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-0.5">{value}</h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100 px-5 py-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search name, roll, class,"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/80 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        <div className="relative">
          <Calendar
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={selectedSession?.old_session_id || ""}
            onChange={(e) => {
              const session = oldSession.find(
                (s) => s.old_session_id == e.target.value,
              );
              if (session) setSelectedSession(session);
              else initialFetch();
            }}
            className="pl-8 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/80 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 appearance-none cursor-pointer transition-all">
            <option value="">All Sessions</option>
            {oldSession?.map((s) => (
              <option key={s.old_session_id} value={s.old_session_id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        <div className="relative">
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="pl-3 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/80 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 appearance-none cursor-pointer transition-all">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch("");
              setFilterGender("");
            }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-xl px-3 py-2.5 transition-all">
            <X size={12} /> Clear
          </button>
        )}

        <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg ring-1 ring-purple-100 ml-auto">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <X size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50/80 to-indigo-50/60 border-b border-purple-100">
                {[
                  "Student",
                  "Roll No",
                  "Class",
                  "Section",
                  "Session",
                  "Gender",
                  "Phone",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <div className="h-4 bg-gray-100 rounded-lg" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length > 0 ? (
                paginated.map((student, idx) => (
                  <tr
                    key={student.old_student_id}
                    className={`group transition-colors duration-150 hover:bg-purple-50/40 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 shadow-sm">
                          {getInitials(student.name)}
                        </div>
                        <span className="font-semibold text-gray-800 truncate max-w-[140px]">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md ring-1 ring-purple-100">
                        #{student.roll_no || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md ring-1 ring-blue-100 whitespace-nowrap">
                        {student.class_name || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold ring-1 ring-indigo-100">
                        {student.section || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-violet-50 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-md ring-1 ring-violet-100 whitespace-nowrap">
                        {student.session_name ||
                          oldSession?.find(
                            (s) => s.old_session_id === student.old_session_id,
                          )?.name ||
                          "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          student.gender === "Male"
                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                            : student.gender === "Female"
                              ? "bg-pink-50 text-pink-700 ring-1 ring-pink-100"
                              : "bg-gray-100 text-gray-500"
                        }`}>
                        {student.gender || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {student.phone || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setViewStudent(student)}
                          title="View Details"
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all">
                          <Eye size={14} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleEditClick(student)}
                          title="Edit"
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300 transition-all">
                          <Pencil size={14} className="text-purple-500" />
                        </button>
                        <button
                          onClick={() => generateCertificate(student)}
                          title="Certificate"
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all">
                          <FileBadge size={14} className="text-emerald-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <Users size={28} className="text-gray-300" />
                      </div>
                      <p className="font-semibold text-gray-500 text-sm">
                        No students found
                      </p>
                      <p className="text-xs text-gray-400">
                        Try adjusting your filters or add a new student
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > PAGE_SIZE && renderPagination()}
      </div>

      {/* View Modal */}
      {renderViewModal()}

      {/* Add Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAddModal(false)
          }>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Old Student
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Register a student from a previous session
                </p>
              </div>
              <button
                onClick={closeModals}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            {renderForm(handleCreate, "Add Student")}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowEditModal(false)
          }>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Student
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Update student information
                </p>
              </div>
              <button
                onClick={closeModals}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            {renderForm(handleUpdate, "Save Changes")}
          </div>
        </div>
      )}
    </div>
  );
};

export default OldStudentsPage;
