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

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const PAGE_SIZE = 10;

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Skeleton loader row */
const SkeletonRow = () => (
  <tr className="border-b border-gray-50 animate-pulse">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-5 py-3.5">
        <div className="h-4 bg-gray-100 rounded-lg" />
      </td>
    ))}
  </tr>
);

/** Status badge */
const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      active
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
        : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
    }`}>
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        active ? "bg-emerald-500" : "bg-gray-400"
      }`}
    />
    {active ? "Active" : "Inactive"}
  </span>
);

/** Stat card */
const StatCard = ({ label, value, icon: Icon, bg, ic }) => (
  <div className="bg-white/70 rounded-2xl border border-purple-100 p-5 hover:shadow-md transition-shadow">
    <div
      className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
      <Icon size={18} className={ic} />
    </div>
    <p className="text-xs text-gray-400 font-medium">{label}</p>
    <h2 className="text-2xl font-bold text-gray-800 mt-0.5">{value}</h2>
  </div>
);

/** Pagination */
const Pagination = ({ page, total, pageSize, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <p className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">
          {Math.min((page - 1) * pageSize + 1, total)}
        </span>
        –
        <span className="font-semibold text-gray-600">
          {Math.min(page * pageSize, total)}
        </span>{" "}
        of <span className="font-semibold text-gray-600">{total}</span> students
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(page - 1)}
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
              onClick={() => onChange(p)}
              className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-all ${
                p === page
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200"
                  : "border-gray-200 hover:bg-purple-50 hover:border-purple-300 text-gray-600"
              }`}>
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-purple-50 hover:border-purple-300 transition-all">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// VIEW DETAILS MODAL
// ─────────────────────────────────────────────
const ViewModal = ({ student, sessions, onClose }) => {
  if (!student) return null;

  const sessionName =
    sessions?.find((s) => s.old_session_id === student.old_session_id)?.name ||
    student.session_name ||
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
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ── Header with gradient ── */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 px-6 py-6 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold ring-2 ring-white/30">
              {getInitials(student.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{student.name}</h2>
              <p className="text-purple-200 text-sm mt-0.5">
                Roll #{student.roll_no || "—"} · {student.class_name || "—"} ·
                Section {student.section || "—"}
              </p>
            </div>
            <StatusBadge active={student.is_active} />
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Student info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                Student Information
              </span>
              <div className="flex-1 h-px bg-purple-100" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InfoCard title="Roll Number" value={`#${student.roll_no}`} />
              <InfoCard title="Class" value={student.class_name} />
              <InfoCard title="Section" value={student.section} />
              <InfoCard title="Academic Session" value={sessionName} />
              <InfoCard title="Gender" value={student.gender} />
              <InfoCard
                title="Date of Birth"
                value={formatDate(student.date_of_birth)}
              />
              <InfoCard title="Phone" value={student.phone} />
              <div className="col-span-2 sm:col-span-3">
                <InfoCard title="Address" value={student.address} />
              </div>
            </div>
          </div>

          {/* Guardian */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                Guardian Details
              </span>
              <div className="flex-1 h-px bg-purple-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InfoCard title="Father's Name" value={student.father_name} />
              <InfoCard title="Mother's Name" value={student.mother_name} />
            </div>
          </div>

          {/* System */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                System Info
              </span>
              <div className="flex-1 h-px bg-purple-100" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InfoCard title="Created By" value={student.created_by} />
              <InfoCard
                title="Created At"
                value={formatDate(student.created_at)}
              />
              <InfoCard
                title="Last Updated"
                value={formatDate(student.updated_at)}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-purple-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
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

  // ── Local state ──
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
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
    is_active: true,
  });

  useEffect(() => {
    initialFetch();
  }, []);

  const resetForm = () => {
    setFormData({
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
      is_active: true,
    });
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
      const matchStatus =
        !filterStatus ||
        (filterStatus === "active" ? s.is_active : !s.is_active);
      return matchSearch && matchGender && matchStatus;
    });
  }, [oldStudents, search, filterGender, filterStatus]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, filterGender, filterStatus, selectedSession]);

  // ── Stats ──
  const activeCount = oldStudents.filter((s) => s.is_active).length;
  const inactiveCount = oldStudents.length - activeCount;
  const hasActiveFilters = search || filterGender || filterStatus;

  // ── Certificate ──
  const generateCertificate = async (student) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const W = 297;
    const H = 210;
    const cx = W / 2;

    // ─────────────────────────────────────────────
    // BACKGROUND
    // ─────────────────────────────────────────────
    doc.setFillColor(253, 250, 245);
    doc.rect(0, 0, W, H, "F");

    // ─────────────────────────────────────────────
    // BORDER SYSTEM — all perfectly inset
    // ─────────────────────────────────────────────
    const M = 8; // outer margin
    const M2 = 11; // second line
    const M3 = 14; // inner content margin

    // 1. Outermost thick red rect
    doc.setDrawColor(160, 10, 10);
    doc.setLineWidth(2.2);
    doc.rect(M, M, W - M * 2, H - M * 2);

    // 2. Thin line just inside
    doc.setLineWidth(0.5);
    doc.rect(M2, M2, W - M2 * 2, H - M2 * 2);

    // 3. Dotted ornamental band — top
    doc.setFillColor(160, 10, 10);
    for (let x = M3 + 2; x < W - M3 - 2; x += 3.5) {
      doc.circle(x, M3, 0.55, "F");
    }
    // bottom
    for (let x = M3 + 2; x < W - M3 - 2; x += 3.5) {
      doc.circle(x, H - M3, 0.55, "F");
    }
    // left
    for (let y = M3 + 2; y < H - M3 - 2; y += 3.5) {
      doc.circle(M3, y, 0.55, "F");
    }
    // right
    for (let y = M3 + 2; y < H - M3 - 2; y += 3.5) {
      doc.circle(W - M3, y, 0.55, "F");
    }

    // 4. Inner thin rect (just inside the dots)
    doc.setDrawColor(160, 10, 10);
    doc.setLineWidth(0.4);
    doc.rect(M3 + 2, M3 + 2, W - (M3 + 2) * 2, H - (M3 + 2) * 2);

    // ─────────────────────────────────────────────
    // CORNER ORNAMENTS — proper placement, no overlap
    // Each corner is a small L-shaped bracket with square
    // ─────────────────────────────────────────────
    const drawCornerOrnament = (x, y, dirX, dirY) => {
      // dirX: 1 = right, -1 = left
      // dirY: 1 = down,  -1 = up

      doc.setFillColor(160, 10, 10);
      doc.setDrawColor(160, 10, 10);
      doc.setLineWidth(1.6);

      // L-bracket lines
      doc.line(x, y, x + dirX * 14, y); // horizontal arm
      doc.line(x, y, x, y + dirY * 14); // vertical arm

      // filled square at the corner tip
      const sq = 4.5;
      doc.rect(x - (dirX < 0 ? sq : 0), y - (dirY < 0 ? sq : 0), sq, sq, "F");

      // small decorative dots along each arm
      doc.setLineWidth(0);
      for (let i = 1; i <= 3; i++) {
        doc.circle(x + dirX * (i * 3.5), y + dirY * 1.5, 0.5, "F");
        doc.circle(x + dirX * 1.5, y + dirY * (i * 3.5), 0.5, "F");
      }
    };

    const pad = M + 1; // align bracket exactly at outer border edge
    drawCornerOrnament(pad, pad, 1, 1); // top-left
    drawCornerOrnament(W - pad, pad, -1, 1); // top-right
    drawCornerOrnament(pad, H - pad, 1, -1); // bottom-left
    drawCornerOrnament(W - pad, H - pad, -1, -1); // bottom-right

    // ─────────────────────────────────────────────
    // WATERMARK — very faint center floral
    // ─────────────────────────────────────────────
    doc.setDrawColor(220, 210, 205);
    doc.setLineWidth(0.15);
    const wy = H / 2 + 8;
    for (let r = 8; r <= 32; r += 6) {
      doc.circle(cx, wy, r, "S");
    }
    for (let a = 0; a < 360; a += 18) {
      const rad = (a * Math.PI) / 180;
      doc.line(cx, wy, cx + 32 * Math.cos(rad), wy + 32 * Math.sin(rad));
    }

    // ─────────────────────────────────────────────
    // TITLE
    // ─────────────────────────────────────────────
    doc.setFont("times", "bold");
    doc.setFontSize(34);
    doc.setTextColor(15, 15, 15);
    doc.text("CERTIFICATE", cx, 38, { align: "center" });

    // red underline below title
    doc.setDrawColor(160, 10, 10);
    doc.setLineWidth(0.7);
    doc.line(cx - 44, 41.5, cx + 44, 41.5);

    // ─────────────────────────────────────────────
    // SUBTITLE
    // ─────────────────────────────────────────────
    doc.setFont("times", "italic");
    doc.setFontSize(13);
    doc.setTextColor(55, 55, 55);
    doc.text("This certificate is presented to", cx, 51, { align: "center" });

    // three dot ornament
    doc.setFillColor(160, 10, 10);
    [-4, 0, 4].forEach((dx) => doc.circle(cx + dx, 56, 0.9, "F"));

    // ─────────────────────────────────────────────
    // SESSION — spaced small caps
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // STUDENT NAME
    // ─────────────────────────────────────────────
    doc.setFont("times", "bolditalic");
    doc.setFontSize(28);
    doc.setTextColor(15, 15, 15);
    doc.text(student.name || "Student Name", cx, 76, { align: "center" });

    // underline name
    const nw = doc.getTextWidth(student.name || "Student Name");
    doc.setDrawColor(130, 10, 10);
    doc.setLineWidth(0.45);
    doc.line(cx - nw / 2, 78.5, cx + nw / 2, 78.5);

    // ─────────────────────────────────────────────
    // CLASS · SECTION · ROLL ROW
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // BODY TEXT
    // ─────────────────────────────────────────────
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    const bodyLines = [
      "This is to certify that the above named student has successfully",
      "completed the academic session at our institution.",
    ];
    bodyLines.forEach((line, i) => {
      doc.text(line, cx, 98 + i * 6.5, { align: "center" });
    });

    // Parents line
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

    // ─────────────────────────────────────────────
    // HORIZONTAL DIVIDER
    // ─────────────────────────────────────────────
    doc.setDrawColor(180, 10, 10);
    doc.setLineWidth(0.4);
    doc.line(28, 122, W - 28, 122);

    // ─────────────────────────────────────────────
    // BOTTOM SECTION  — Date | Seal | Signature
    // Y baseline = 155
    // ─────────────────────────────────────────────
    const BY = 158; // bottom row baseline

    // ── DATE (left-aligned block) ──────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.setCharSpace(2);
    doc.text("DATE", 32, BY - 8);
    doc.setCharSpace(0);

    const issuedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text(issuedDate, 50, BY - 8);

    // date underline
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.3);
    doc.line(48, BY - 6, 95, BY - 6);

    // ── SEAL — image from public folder ────────
    // Place seal image (PNG/JPG) in your /public folder as "seal.png"
    // jsPDF addImage: (imageData, format, x, y, width, height)
    try {
      // Fetch the seal from public folder
      const sealResponse = await fetch("/seal.png");
      const sealBlob = await sealResponse.blob();
      const sealBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(sealBlob);
      });

      const sealSize = 28;
      doc.addImage(
        sealBase64,
        "PNG",
        cx - sealSize / 2, // centered X
        BY - 22, // Y position
        sealSize, // width
        sealSize, // height
      );
    } catch {
      // Fallback: draw a red wax seal if image not found
      doc.setFillColor(150, 8, 8);
      doc.circle(cx, BY - 8, 13, "F");
      doc.setFillColor(170, 20, 20);
      doc.circle(cx, BY - 8, 10, "F");
      doc.setFillColor(185, 35, 35);
      doc.circle(cx, BY - 8, 7, "F");
      // star rays
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

    // ── SIGNATURE (right-aligned block) ────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.setCharSpace(2);
    doc.text("SIGNATURE", W - 100, BY - 8);
    doc.setCharSpace(0);

    // blank line for handwritten signature
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.3);
    doc.line(W - 80, BY - 6, W - 30, BY - 6);

    // "Principal" label below line
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text("Principal / Authority", W - 55, BY - 1, { align: "center" });

    // ─────────────────────────────────────────────
    // ADDRESS / PHONE — very small footer
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // SAVE
    // ─────────────────────────────────────────────
    doc.save(`${student.name || "student"}-certificate.pdf`);
  };

  // ── CRUD ──
  const handleCreate = async () => {
    if (!formData.name || !formData.old_session_id) {
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
      is_active: student.is_active ?? true,
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

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedStudent(null);
    resetForm();
  };

  const clearFilters = () => {
    setSearch("");
    setFilterGender("");
    setFilterStatus("");
  };

  // ── Form (reused for Add / Edit) ──
  const StudentForm = ({ onSubmit, submitLabel }) => (
    <>
      <div className="overflow-y-auto flex-1 px-6 py-5">
        {/* Basic Info */}
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
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={formData.is_active ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_active: e.target.value === "true",
                })
              }
              className={inputClass}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Guardian */}
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

      {/* Footer */}
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
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-purple-200">
          <Save size={15} />
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </>
  );

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="p-6 min-h-screen space-y-5">
      {/* ═══════════ Header ═══════════ */}
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
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-purple-200">
          <Plus size={16} />
          Add Student
        </button>
      </div>

      {/* ═══════════ Stat Cards ═══════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={oldStudents.length}
          icon={Users}
          bg="bg-purple-50"
          ic="text-purple-500"
        />
        {/* <StatCard
          label="Filtered"
          value={filtered.length}
          icon={Search}
          bg="bg-blue-50"
          ic="text-blue-500"
        /> */}
        <StatCard
          label="Active"
          value={activeCount}
          icon={UserCheck}
          bg="bg-green-50"
          ic="text-green-500"
        />
        <StatCard
          label="Inactive"
          value={inactiveCount}
          icon={UserX}
          bg="bg-red-50"
          ic="text-red-500"
        />
      </div>

      {/* ═══════════ Filters ═══════════ */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100 px-5 py-4 flex flex-wrap items-center gap-3 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search name, roll, class, father..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/80 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        {/* Session filter */}
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

        {/* Gender filter */}
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

        {/* Status filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-3 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/80 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 appearance-none cursor-pointer transition-all">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-xl px-3 py-2.5 transition-all">
            <X size={12} />
            Clear
          </button>
        )}

        {/* Result count */}
        <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg ring-1 ring-purple-100 ml-auto">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ═══════════ Error ═══════════ */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <X size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ═══════════ Table ═══════════ */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            {/* ── Head ── */}
            <thead>
              <tr className="bg-gradient-to-r from-purple-50/80 to-indigo-50/60 border-b border-purple-100">
                {[
                  { label: "Student", align: "left" },
                  { label: "Roll No", align: "left" },
                  { label: "Class", align: "left" },
                  { label: "Section", align: "left" },
                  { label: "Session", align: "left" },
                  { label: "Status", align: "left" },
                  { label: "Actions", align: "center" },
                ].map(({ label, align }) => (
                  <th
                    key={label}
                    className={`px-5 py-3.5 text-${align} text-[11px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length > 0 ? (
                paginated.map((student, idx) => (
                  <tr
                    key={student.old_student_id}
                    className={`
                      group transition-colors duration-150 hover:bg-purple-50/40
                      ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                    `}>
                    {/* Student Name + Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 shadow-sm">
                          {getInitials(student.name)}
                        </div>
                        <span className="font-semibold text-gray-800 truncate max-w-[160px]">
                          {student.name}
                        </span>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md ring-1 ring-purple-100">
                        #{student.roll_no || "—"}
                      </span>
                    </td>

                    {/* Class */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md ring-1 ring-blue-100 whitespace-nowrap">
                        {student.class_name || "—"}
                      </span>
                    </td>

                    {/* Section */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold ring-1 ring-indigo-100">
                        {student.section || "—"}
                      </span>
                    </td>

                    {/* Session */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center bg-violet-50 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-md ring-1 ring-violet-100 whitespace-nowrap max-w-[130px] truncate">
                        {student.session_name || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge active={student.is_active} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewStudent(student)}
                          title="View Details"
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm transition-all duration-150">
                          <Eye size={15} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleEditClick(student)}
                          title="Edit Student"
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300 hover:shadow-sm transition-all duration-150">
                          <Pencil size={15} className="text-purple-500" />
                        </button>
                        <button
                          onClick={() => generateCertificate(student)}
                          title="Download Certificate"
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-sm transition-all duration-150">
                          <FileBadge size={15} className="text-emerald-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <Users size={28} className="text-gray-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500 text-sm">
                          No students found
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Try adjusting your filters or add a new student
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            <Pagination
              page={page}
              total={filtered.length}
              pageSize={PAGE_SIZE}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      {/* ═══════════ View Modal ═══════════ */}
      {viewStudent && (
        <ViewModal
          student={viewStudent}
          sessions={oldSession}
          onClose={() => setViewStudent(null)}
        />
      )}

      {/* ═══════════ Add Modal ═══════════ */}
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
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <StudentForm onSubmit={handleCreate} submitLabel="Add Student" />
          </div>
        </div>
      )}

      {/* ═══════════ Edit Modal ═══════════ */}
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
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <StudentForm onSubmit={handleUpdate} submitLabel="Save Changes" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OldStudentsPage;
