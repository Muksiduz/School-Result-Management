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
  father_name: "",
  mother_name: "",
  phone: "",
  gender: "",
  date_of_birth: "",
  address: "",
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
    setSelectedStudent(student);
    setFormData({
      name: student.name || "",
      roll_no: student.roll_no || "",
      old_session_id: student.old_session_id || "",
      class_name: student.class_name || "",
      section: student.section || "",
      father_name: student.father_name || "",
      mother_name: student.mother_name || "",
      phone: student.phone || "",
      gender: student.gender || "",
      date_of_birth: student.date_of_birth?.split("T")[0] || "",
      address: student.address || "",
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
  const generateCertificate = async (student) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const W = 297;
    const H = 210;
    const cx = W / 2;

    doc.setFillColor(253, 250, 245);
    doc.rect(0, 0, W, H, "F");

    const M = 8,
      M2 = 11,
      M3 = 14;

    doc.setDrawColor(160, 10, 10);
    doc.setLineWidth(2.2);
    doc.rect(M, M, W - M * 2, H - M * 2);

    doc.setLineWidth(0.5);
    doc.rect(M2, M2, W - M2 * 2, H - M2 * 2);

    doc.setFillColor(160, 10, 10);
    for (let x = M3 + 2; x < W - M3 - 2; x += 3.5) doc.circle(x, M3, 0.55, "F");
    for (let x = M3 + 2; x < W - M3 - 2; x += 3.5)
      doc.circle(x, H - M3, 0.55, "F");
    for (let y = M3 + 2; y < H - M3 - 2; y += 3.5) doc.circle(M3, y, 0.55, "F");
    for (let y = M3 + 2; y < H - M3 - 2; y += 3.5)
      doc.circle(W - M3, y, 0.55, "F");

    doc.setDrawColor(160, 10, 10);
    doc.setLineWidth(0.4);
    doc.rect(M3 + 2, M3 + 2, W - (M3 + 2) * 2, H - (M3 + 2) * 2);

    const drawCorner = (x, y, dirX, dirY) => {
      doc.setFillColor(160, 10, 10);
      doc.setDrawColor(160, 10, 10);
      doc.setLineWidth(1.6);
      doc.line(x, y, x + dirX * 14, y);
      doc.line(x, y, x, y + dirY * 14);
      const sq = 4.5;
      doc.rect(x - (dirX < 0 ? sq : 0), y - (dirY < 0 ? sq : 0), sq, sq, "F");
      doc.setLineWidth(0);
      for (let i = 1; i <= 3; i++) {
        doc.circle(x + dirX * (i * 3.5), y + dirY * 1.5, 0.5, "F");
        doc.circle(x + dirX * 1.5, y + dirY * (i * 3.5), 0.5, "F");
      }
    };

    const pad = M + 1;
    drawCorner(pad, pad, 1, 1);
    drawCorner(W - pad, pad, -1, 1);
    drawCorner(pad, H - pad, 1, -1);
    drawCorner(W - pad, H - pad, -1, -1);

    doc.setDrawColor(220, 210, 205);
    doc.setLineWidth(0.15);
    const wy = H / 2 + 8;
    for (let r = 8; r <= 32; r += 6) doc.circle(cx, wy, r, "S");
    for (let a = 0; a < 360; a += 18) {
      const rad = (a * Math.PI) / 180;
      doc.line(cx, wy, cx + 32 * Math.cos(rad), wy + 32 * Math.sin(rad));
    }

    doc.setFont("times", "bold");
    doc.setFontSize(34);
    doc.setTextColor(15, 15, 15);
    doc.text("CERTIFICATE", cx, 38, { align: "center" });
    doc.setDrawColor(160, 10, 10);
    doc.setLineWidth(0.7);
    doc.line(cx - 44, 41.5, cx + 44, 41.5);

    doc.setFont("times", "italic");
    doc.setFontSize(13);
    doc.setTextColor(55, 55, 55);
    doc.text("This certificate is presented to", cx, 51, { align: "center" });
    doc.setFillColor(160, 10, 10);
    [-4, 0, 4].forEach((dx) => doc.circle(cx + dx, 56, 0.9, "F"));

    const sessionLabel = (
      student.session_name ||
      `Session ${student.old_session_id || ""}` ||
      "Academic Session"
    ).toUpperCase();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.setCharSpace(3);
    doc.text(sessionLabel, cx, 63, { align: "center" });
    doc.setCharSpace(0);

    doc.setFont("times", "bolditalic");
    doc.setFontSize(28);
    doc.setTextColor(15, 15, 15);
    doc.text(student.name || "Student Name", cx, 76, { align: "center" });
    const nw = doc.getTextWidth(student.name || "Student Name");
    doc.setDrawColor(130, 10, 10);
    doc.setLineWidth(0.45);
    doc.line(cx - nw / 2, 78.5, cx + nw / 2, 78.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(25, 25, 25);
    doc.setCharSpace(1.8);
    const metaLine = [
      student.class_name ? `CLASS ${student.class_name}` : "",
      student.section ? `SECTION ${student.section}` : "",
      student.roll_no ? `ROLL NO. ${student.roll_no}` : "",
    ]
      .filter(Boolean)
      .join("   ·   ");
    doc.text(metaLine, cx, 88, { align: "center" });
    doc.setCharSpace(0);

    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    [
      "This is to certify that the above named student has successfully",
      "completed the academic session at our institution.",
    ].forEach((line, i) =>
      doc.text(line, cx, 98 + i * 6.5, { align: "center" }),
    );

    if (student.father_name || student.mother_name) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const parentsLine = [
        student.father_name ? `Father: ${student.father_name}` : "",
        student.mother_name ? `Mother: ${student.mother_name}` : "",
      ]
        .filter(Boolean)
        .join("     ");
      doc.text(parentsLine, cx, 113, { align: "center" });
    }

    doc.setDrawColor(180, 10, 10);
    doc.setLineWidth(0.4);
    doc.line(28, 122, W - 28, 122);

    const BY = 158;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.setCharSpace(2);
    doc.text("DATE", 32, BY - 8);
    doc.setCharSpace(0);
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text(
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      50,
      BY - 8,
    );
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.3);
    doc.line(48, BY - 6, 95, BY - 6);

    try {
      const sealResponse = await fetch("/seal.png");
      const sealBlob = await sealResponse.blob();
      const sealBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(sealBlob);
      });
      doc.addImage(sealBase64, "PNG", cx - 14, BY - 22, 28, 28);
    } catch {
      doc.setFillColor(150, 8, 8);
      doc.circle(cx, BY - 8, 13, "F");
      doc.setFillColor(170, 20, 20);
      doc.circle(cx, BY - 8, 10, "F");
      doc.setFillColor(185, 35, 35);
      doc.circle(cx, BY - 8, 7, "F");
      doc.setDrawColor(210, 160, 160);
      doc.setLineWidth(0.25);
      for (let a = 0; a < 360; a += 30) {
        const rad = (a * Math.PI) / 180;
        doc.line(
          cx + 3 * Math.cos(rad),
          BY - 8 + 3 * Math.sin(rad),
          cx + 10 * Math.cos(rad),
          BY - 8 + 10 * Math.sin(rad),
        );
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.5);
      doc.setTextColor(255, 220, 220);
      doc.text("OFFICIAL", cx, BY - 10, { align: "center" });
      doc.text("SEAL", cx, BY - 7, { align: "center" });
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.setCharSpace(2);
    doc.text("SIGNATURE", W - 100, BY - 8);
    doc.setCharSpace(0);
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.3);
    doc.line(W - 80, BY - 6, W - 30, BY - 6);
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text("Principal / Authority", W - 55, BY - 1, { align: "center" });

    const contactParts = [
      student.phone ? `Phone: ${student.phone}` : "",
      student.address ? `Address: ${student.address}` : "",
    ].filter(Boolean);
    if (contactParts.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(160, 160, 160);
      doc.text(contactParts.join("   |   "), cx, H - 19, {
        align: "center",
        maxWidth: W - 60,
      });
    }

    doc.save(`${student.name || "student"}-certificate.pdf`);
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
