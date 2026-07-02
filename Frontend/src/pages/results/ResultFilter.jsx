import { useEffect, useState, useMemo } from "react";
import useMarksEntryStore from "../../store/marksEntryStore";
import useViewResultStore from "../../store/viewResultStore";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Feather, Pencil, Save, X } from "lucide-react";
import api from "../../utils/axios";

function ResultFilter() {
  const {
    selectedSession,
    selectedClass,
    selectedSection,
    selectedStudent,
    selectedUnitTest,
    students,
    unitTests,
    fullResult,
    loading,
    error,
    setSelectedSession,
    setSelectedClass,
    setSelectedSection,
    sections,
    fetchUnitTests,
    fetchStudents,
    fetchFullResult,
  } = useViewResultStore();

  const { sessions, classes, fetchInitialData } = useMarksEntryStore();

  const [viewMode, setViewMode] = useState("students");
  const [editModal, setEditModal] = useState(false);
  const [rollFilter, setRollFilter] = useState("");

  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        student.roll_no
          ?.toString()
          .toLowerCase()
          .includes(rollFilter.toLowerCase()),
      ),
    [students, rollFilter],
  );

  const [editMark, setEditMark] = useState({
    subject_id: "",
    student_id: "",
    unit_test_id: "",
    subject_name: "",
    marks_obtained: "",
    max_marks: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Recomputes whenever fullResult changes in the store (fixes edit not reflecting in UI)
  const arrangedResult = useMemo(() => {
    if (!fullResult?.length) return null;
    return {
      student_id: fullResult[0]?.student_id,
      student_name: fullResult[0]?.student_name,
      test_name: fullResult[0]?.test_name,
      class_name: fullResult[0]?.class_name,
      section_name: fullResult[0]?.section_name,
      father_name: fullResult[0]?.father_name,
      session_name: fullResult[0]?.session_name,
      roll_no: fullResult[0]?.roll_no,
      subjects: fullResult.map((r) => ({
        subject_id: r.subject_id,
        subject_name: r.subject_name,
        marks_obtained: Number(r.marks_obtained),
        max_marks: Number(r.max_marks),
        percentage: Number(
          ((Number(r.marks_obtained) / Number(r.max_marks)) * 100).toFixed(1),
        ),
      })),
      total_marks: fullResult.reduce(
        (acc, r) => acc + Number(r.marks_obtained),
        0,
      ),
      total_max_marks: fullResult.reduce(
        (acc, r) => acc + Number(r.max_marks),
        0,
      ),
      percentage: (
        (fullResult.reduce((acc, r) => acc + Number(r.marks_obtained), 0) /
          fullResult.reduce((acc, r) => acc + Number(r.max_marks), 0)) *
        100
      ).toFixed(2),
    };
  }, [fullResult]);

  // Rule: fail in maths, science OR assamese = overall FAIL, other subjects don't affect pass/fail
  const COMPULSORY = ["mathematics", "math", "science", "assamese"];

  const failedSubjects = useMemo(
    () =>
      arrangedResult?.subjects?.filter((subject) => {
        const isCompulsory = COMPULSORY.some((c) =>
          subject.subject_name?.toLowerCase().includes(c),
        );
        // only compulsory subjects can cause a fail
        return isCompulsory && subject.marks_obtained < subject.max_marks * 0.3;
      }) ?? [],
    [arrangedResult],
  );

  const isFailed = failedSubjects.length > 0;
  const resultStatus = isFailed ? "FAIL" : "PASS";

  const getGrade = (percentage, subjects) => {
    // If failed any compulsory subject → F, skip percentage curve entirely
    const hasFailedCompulsory = subjects?.some((subject) => {
      const isCompulsory = COMPULSORY.some((c) =>
        subject.subject_name?.toLowerCase().includes(c),
      );
      return isCompulsory && Number(subject.percentage) < 30;
    });

    if (hasFailedCompulsory)
      return {
        grade: "F",
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-300",
      };

    if (percentage >= 90)
      return {
        grade: "A+",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    if (percentage >= 80)
      return {
        grade: "A",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    if (percentage >= 70)
      return {
        grade: "B+",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    if (percentage >= 60)
      return {
        grade: "B",
        color: "text-yellow-700",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      };
    if (percentage >= 50)
      return {
        grade: "C",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };
    if (percentage >= 30)
      return {
        grade: "D",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
      };
    return {
      grade: "F",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-300",
    };
  };

  const gradeInfo = useMemo(
    () =>
      arrangedResult
        ? getGrade(Number(arrangedResult.percentage), arrangedResult.subjects)
        : null,
    [arrangedResult],
  );

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 50) return "bg-orange-500";
    if (percentage >= 40) return "bg-indigo-500";
    return "bg-red-500";
  };
  // export pdf function
  const handleExportPDF = () => {
    if (!arrangedResult) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ── FIXED: use the same compulsory-subject rule as the UI ──────────────────
    const COMPULSORY = ["mathematics", "math", "science", "assamese"];

    const isSubjectFailed = (subject) =>
      Number(subject.marks_obtained) < Number(subject.max_marks) * 0.3;

    const isCompulsoryFailed = (subject) =>
      COMPULSORY.some((c) => subject.subject_name?.toLowerCase().includes(c)) &&
      isSubjectFailed(subject);

    const pdfIsFailed = arrangedResult.subjects.some(isCompulsoryFailed);
    const pdfResultStatus = pdfIsFailed ? "FAIL" : "PASS";

    const gradeInfo = pdfIsFailed
      ? { grade: "F" }
      : getGrade(Number(arrangedResult.percentage), arrangedResult.subjects);
    // ───────────────────────────────────────────────────────────────────────────

    const resultDate = arrangedResult.result_date
      ? new Date(arrangedResult.result_date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

    const M = 12;
    const W = pageWidth - M * 2;

    // ============================================================
    // HEADER
    // ============================================================
    doc.setFillColor(109, 40, 217);
    doc.rect(0, 0, pageWidth, 38, "F");

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(196, 181, 253);
    doc.text(
      `Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
      pageWidth - M,
      8,
      { align: "right" },
    );

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("TARANGAJHAR HIGH SCHOOL", pageWidth / 2, 18, { align: "center" });

    doc.setDrawColor(196, 181, 253);
    doc.setLineWidth(0.3);
    doc.line(M + 10, 23, pageWidth - M - 10, 23);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(221, 214, 254);
    doc.text("STUDENT ACADEMIC REPORT CARD", pageWidth / 2, 31, {
      align: "center",
    });

    // ============================================================
    // SESSION BAR
    // ============================================================
    doc.setFillColor(243, 240, 255);
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(0.3);
    doc.rect(M, 42, W, 9, "FD");

    doc.setDrawColor(221, 214, 254);
    doc.line(pageWidth / 2, 42, pageWidth / 2, 51);

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(109, 40, 217);
    doc.text("SESSION :", M + 4, 47.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(arrangedResult.session_name || "-", M + 24, 47.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(109, 40, 217);
    doc.text("RESULT DATE :", pageWidth / 2 + 4, 47.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(resultDate, pageWidth / 2 + 30, 47.5);

    // ============================================================
    // STUDENT INFO CARD
    // ============================================================
    doc.setFillColor(109, 40, 217);
    doc.rect(M, 54, W, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT INFORMATION", pageWidth / 2, 58.8, { align: "center" });

    doc.setFillColor(250, 248, 255);
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(0.3);
    doc.rect(M, 61, W, 40, "FD");

    doc.setDrawColor(221, 214, 254);
    doc.line(pageWidth / 2, 61, pageWidth / 2, 101);

    [70, 79, 88].forEach((y) => {
      doc.setDrawColor(237, 233, 254);
      doc.setLineWidth(0.2);
      doc.line(M, y, pageWidth - M, y);
    });

    const c1L = M + 4;
    const c1V = M + 34;
    const c2L = pageWidth / 2 + 4;
    const c2V = pageWidth / 2 + 34;
    const r0 = 67.5;
    const rG = 9;

    const col1 = [
      { label: "Student Name", value: arrangedResult.student_name || "-" },
      { label: "Father's Name", value: arrangedResult.father_name || "-" },
      { label: "Roll Number", value: String(arrangedResult.roll_no || "-") },
      { label: "Class", value: arrangedResult.class_name || "-" },
    ];

    const col2 = [
      { label: "Section", value: arrangedResult.section_name || "-" },
      { label: "Examination", value: arrangedResult.test_name || "-" },
      { label: "Grade", value: gradeInfo.grade },
      // ── FIXED: use pdfResultStatus instead of resultStatus from outer scope ──
      { label: "Result", value: pdfResultStatus, isResult: true },
    ];

    col1.forEach((row, i) => {
      const y = r0 + i * rG;
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(109, 40, 217);
      doc.text(row.label + " :", c1L, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(20, 20, 20);
      doc.text(row.value, c1V, y);
    });

    col2.forEach((row, i) => {
      const y = r0 + i * rG;
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(109, 40, 217);
      doc.text(row.label + " :", c2L, y);

      if (row.isResult) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        // ── FIXED: pdfIsFailed drives the color ────────────────────────────────
        doc.setTextColor(
          pdfIsFailed ? 200 : 22,
          pdfIsFailed ? 0 : 163,
          pdfIsFailed ? 0 : 74,
        );
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(20, 20, 20);
      }
      doc.text(row.value, c2V, y);
    });

    // ============================================================
    // SUBJECT TABLE HEADING BAR
    // ============================================================
    doc.setFillColor(109, 40, 217);
    doc.rect(M, 104, W, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("SUBJECT-WISE PERFORMANCE", pageWidth / 2, 108.8, {
      align: "center",
    });

    // ============================================================
    // SUBJECT TABLE
    // ============================================================
    autoTable(doc, {
      startY: 113,
      head: [
        [
          "#",
          "Subject",
          "Max Marks",
          "Marks Obtained",
          "Percentage",
          "Grade",
          "Result",
        ],
      ],
      body: arrangedResult.subjects.map((subject, idx) => {
        const subPct = Number(subject.percentage);
        // ── FIXED: 30% of max_marks threshold, not hardcoded < 30 ──────────────
        const subFailed = isSubjectFailed(subject);
        const subGrade = subFailed
          ? "F"
          : getGrade(subPct, arrangedResult.subjects).grade;
        return [
          idx + 1,
          subject.subject_name,
          subject.max_marks,
          subject.marks_obtained,
          `${subject.percentage}%`,
          subGrade,
          subFailed ? "FAIL" : "PASS",
        ];
      }),
      theme: "grid",
      headStyles: {
        fillColor: [237, 233, 254],
        textColor: [76, 29, 149],
        halign: "center",
        fontStyle: "bold",
        fontSize: 8.5,
        cellPadding: 3,
      },
      bodyStyles: {
        halign: "center",
        fontSize: 7.5,
        textColor: [30, 30, 30],
        cellPadding: 4,
      },
      alternateRowStyles: { fillColor: [250, 248, 255] },
      columnStyles: { 0: { halign: "center" }, 1: { halign: "left" } },
      tableWidth: W,
      margin: { left: M, right: M },
      didParseCell: (data) => {
        if (data.section === "body") {
          const rowSubject = arrangedResult.subjects[data.row.index];
          // ── FIXED: same threshold function as everywhere else ─────────────────
          const subjectFailed = isSubjectFailed(rowSubject);
          if (subjectFailed) {
            data.cell.styles.fillColor = [255, 237, 237];
            data.cell.styles.textColor = [180, 0, 0];
            if (data.column.index === 6) {
              data.cell.styles.fontStyle = "bold";
              data.cell.styles.textColor = [200, 0, 0];
            }
          }
        }
      },
    });

    // ============================================================
    // RESULT SUMMARY BAR + BOX
    // ============================================================
    const finalY = doc.lastAutoTable.finalY + 5;

    doc.setFillColor(109, 40, 217);
    doc.rect(M, finalY, W, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("RESULT SUMMARY", pageWidth / 2, finalY + 5, { align: "center" });

    doc.setFillColor(250, 248, 255);
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(0.3);
    doc.rect(M, finalY + 7, W, 18, "FD");

    const cols = [
      { label: "Max Marks", value: String(arrangedResult.total_max_marks) },
      { label: "Marks Obtained", value: String(arrangedResult.total_marks) },
      { label: "Percentage", value: `${arrangedResult.percentage}%` },
      { label: "Grade", value: gradeInfo.grade },
      // ── FIXED: pdfResultStatus ────────────────────────────────────────────────
      { label: "Result", value: pdfResultStatus },
    ];

    const colW = W / cols.length;

    cols.forEach((col, i) => {
      const x = M + i * colW + colW / 2;
      const isResult = col.label === "Result";

      doc.setFontSize(5.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(109, 40, 217);
      doc.text(col.label.toUpperCase(), x, finalY + 12, { align: "center" });

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      if (isResult) {
        // ── FIXED: pdfIsFailed ──────────────────────────────────────────────────
        doc.setTextColor(
          pdfIsFailed ? 200 : 22,
          pdfIsFailed ? 0 : 163,
          pdfIsFailed ? 0 : 74,
        );
      } else {
        doc.setTextColor(20, 20, 20);
      }
      doc.text(col.value, x, finalY + 21, { align: "center" });

      if (i < cols.length - 1) {
        doc.setDrawColor(221, 214, 254);
        doc.setLineWidth(0.2);
        doc.line(
          M + (i + 1) * colW,
          finalY + 9,
          M + (i + 1) * colW,
          finalY + 24,
        );
      }
    });

    // ============================================================
    // BOTTOM SECTION — Grade Scale LEFT + Signature RIGHT
    // ============================================================
    const bottomY = finalY + 30;
    const gradeColWidth = W * 0.55;
    const sigColWidth = W * 0.45;

    doc.setFillColor(109, 40, 217);
    doc.rect(M, bottomY, gradeColWidth, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("GRADING SCALE", M + gradeColWidth / 2, bottomY + 5, {
      align: "center",
    });

    const gradeScale = [
      { range: "90-100%", grade: "A+" },
      { range: "80-89%", grade: "A" },
      { range: "70-79%", grade: "B+" },
      { range: "60-69%", grade: "B" },
      { range: "50-59%", grade: "C" },
      { range: "40-49%", grade: "D" },
      { range: "< 40%", grade: "F" },
    ];

    const gradeRowH = 7;
    const gradeTableH = gradeScale.length * gradeRowH;

    doc.setFillColor(250, 248, 255);
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(0.3);
    doc.rect(M, bottomY + 7, gradeColWidth, gradeTableH, "FD");

    gradeScale.forEach((g, i) => {
      const gy = bottomY + 7 + i * gradeRowH;
      const midY = gy + gradeRowH / 2 + 1.5;

      if (i > 0) {
        doc.setDrawColor(237, 233, 254);
        doc.setLineWidth(0.2);
        doc.line(M, gy, M + gradeColWidth, gy);
      }

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(109, 40, 217);
      doc.text(g.grade, M + gradeColWidth * 0.22, midY, { align: "center" });

      doc.setDrawColor(221, 214, 254);
      doc.setLineWidth(0.2);
      doc.line(
        M + gradeColWidth * 0.38,
        gy,
        M + gradeColWidth * 0.38,
        gy + gradeRowH,
      );

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(g.range, M + gradeColWidth * 0.7, midY, { align: "center" });
    });

    const sigX = M + gradeColWidth + 4;
    const sigAreaW = sigColWidth - 4;
    const sigLineY = bottomY + 7 + gradeTableH - 8;

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(sigX + 4, sigLineY, sigX + sigAreaW - 4, sigLineY);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Principal Signature", sigX + sigAreaW / 2, sigLineY + 5, {
      align: "center",
    });

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`Date: ${resultDate}`, sigX + sigAreaW / 2, sigLineY + 10, {
      align: "center",
    });

    // ============================================================
    // FOOTER
    // ============================================================
    doc.setFillColor(109, 40, 217);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(196, 181, 253);
    doc.text(
      "This is a computer generated report card and does not require a physical stamp.",
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" },
    );

    doc.save(`${arrangedResult.student_name}-ReportCard.pdf`);
  };
  // handle update function is here
  const handleUpdateMark = async () => {
    try {
      await api.patch(`/results/update-mark`, {
        student_id: editMark.student_id,
        unit_test_id: editMark.unit_test_id,
        subject_id: editMark.subject_id,
        marks_obtained: Number(editMark.marks_obtained),
      });

      alert("Marks Updated");

      setEditModal(false);

      fetchFullResult(selectedUnitTest);
    } catch (error) {
      console.log(error);
      alert("Failed To Update Marks");
    }
  };
  return (
    <div className="p-6 min-h-screen">
      <div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-gray-400 text-sm mb-2">Home / Results</p>

            <h1 className="text-2xl font-semibold text-gray-800">Results</h1>

            <p className="text-gray-500 text-md">
              Search and analyze student performance reports
            </p>
          </div>

          <div className="bg-linear-to-r from-purple-600 to-violet-600   bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg min-w-45">
            <p className="text-purple-100 text-sm">Total Students</p>

            <h2 className="text-3xl font-bold ">{students.length}</h2>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-purple-100 shadow-SM p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Academic Session
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={selectedSession?.session_id || ""}
                onChange={(e) => {
                  const s = sessions.find(
                    (s) => s.session_id == e.target.value,
                  );
                  setSelectedSession(s);
                }}>
                <option value="">Select Session</option>
                {sessions.map((s) => (
                  <option key={s.session_id} value={s.session_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={selectedClass?.class_id || ""}
                onChange={(e) => {
                  const c = classes.find((c) => c.class_id == e.target.value);
                  setSelectedClass(c);
                }}>
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Section
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={selectedSection?.section_id || ""}
                onChange={(e) => {
                  const s = sections.find(
                    (s) => s.section_id == e.target.value,
                  );
                  setSelectedSection(s);
                }}>
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s.section_id} value={s.section_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              fetchStudents();
              setViewMode("students");
            }}
            disabled={
              !selectedSession || !selectedClass || !selectedSection || loading
            }
            className="bg-linear-to-r from-purple-600 to-violet-700 hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Students
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {viewMode === "students" && students.length > 0 && (
          <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-8">
            <div className="px-6 py-4 border-b border-gray-200 bg-[#f8f7ff] flex justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Students ({students.length})
              </h3>
              {/* for search with roll  */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Search by Roll Number..."
                  value={rollFilter}
                  onChange={(e) => setRollFilter(e.target.value)}
                  className="
  w-full
  max-w-sm
  px-4
  py-3
  bg-white
  border
  border-purple-200
  rounded-2xl
  text-gray-700
  placeholder:text-gray-400
  shadow-sm
  transition-all
  duration-200
  focus:outline-none
  focus:border-purple-500
  focus:ring-4
  focus:ring-purple-100
  focus:shadow-md
"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <div
                  key={student.student_id}
                  className="p-4 hover:bg-blue-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {student.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "?"}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {student.name}
                      </h4>
                      <div className="flex justify-start gap-8">
                        <p className="text-xs text-gray-500 mt-1">
                          Student ID: #{student.student_id || "-"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Roll No: {student.roll_no || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      fetchUnitTests(student);
                      setViewMode("tests");
                    }}
                    className="text-purple-700 hover:text-blue-700 hover:bg-purple-100 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1">
                    View Tests
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* for unit tests  */}
        {viewMode === "tests" && unitTests.length > 0 && (
          <div className="bg-white rounded-3xl border border-purple-100 shadow-SM overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Unit Tests ({unitTests.length})
              </h3>
              <button
                onClick={() => setViewMode("students")}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Students
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {unitTests.map((test) => (
                <div
                  key={test.unit_test_id || test.test_id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => {
                    fetchFullResult(test);
                    setViewMode("result");
                  }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {test.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {test.unit_test_id || test.test_id}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                  {test.max_marks && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      Max Marks:{" "}
                      <span className="font-semibold">{test.max_marks}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === "result" && arrangedResult && (
          <div className="space-y-6">
            {/* export button */}
            <div className="flex justify-between">
              <button
                onClick={() => setViewMode("tests")}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Unit Tests
              </button>

              <button
                onClick={handleExportPDF}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700">
                Export PDF
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-purple-100 shadow-SM p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    {arrangedResult.student_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "?"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {arrangedResult.student_name}
                    </h2>
                    <p className="text-gray-500">
                      Student ID: {arrangedResult.student_id}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-blue-800">
                        {arrangedResult.test_name}
                      </span>
                    </div>
                  </div>
                </div>

                {gradeInfo && (
                  <div
                    className={`px-6 py-3 rounded-xl border-2 ${gradeInfo.border} ${gradeInfo.bg} text-center`}>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                      Overall Grade
                    </p>
                    <p className={`text-4xl font-bold ${gradeInfo.color}`}>
                      {gradeInfo.grade}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl border border-purple-100 shadow-SM p-6 text-center">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Marks
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {arrangedResult.total_marks}
                  <span className="text-lg text-gray-400 font-normal">
                    {" "}
                    / {arrangedResult.total_max_marks}
                  </span>
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-purple-100 shadow-SM p-6 text-center">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Percentage
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {arrangedResult.percentage}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(Number(arrangedResult.percentage))}`}
                    style={{
                      width: `${Math.min(Number(arrangedResult.percentage), 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-purple-100 shadow-SM p-6 text-center">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Subjects
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {arrangedResult.subjects.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Total subjects appeared
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-purple-100 shadow-SM overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Subject-wise Performance
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Marks Obtained
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Max Marks
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-center px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {arrangedResult.subjects.map((subject, index) => {
                      const subjGrade = getGrade(Number(subject.percentage));
                      return (
                        <tr
                          key={index}
                          className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                {subject.subject_name?.charAt(0)?.toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {subject.subject_name}
                                {/* {subject.subject_id} */}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-semibold text-gray-900">
                              {subject.marks_obtained}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm text-gray-500">
                              {subject.max_marks}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`text-sm font-semibold ${subjGrade.color}`}>
                              {subject.percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(Number(subject.percentage))}`}
                                style={{
                                  width: `${Math.min(Number(subject.percentage), 100)}%`,
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subjGrade.bg} ${subjGrade.color} border ${subjGrade.border}`}>
                              {subjGrade.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => {
                                setEditMark({
                                  student_id: selectedStudent.student_id,
                                  unit_test_id: selectedUnitTest.test_id,
                                  subject_id: subject.subject_id,
                                  subject_name: subject.subject_name,
                                  marks_obtained: subject.marks_obtained,
                                  max_marks: subject.max_marks,
                                });

                                setEditModal(true);
                              }}
                              className="
    inline-flex
    items-center
    gap-2
    px-3
    py-2
    rounded-xl
    bg-purple-50
    text-purple-700
    hover:bg-purple-100
    transition-all
    border
    border-purple-200
    font-medium
    text-sm
  ">
                              <Pencil size={14} />
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        Total
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        {arrangedResult.total_marks}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        {arrangedResult.total_max_marks}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-purple-700">
                        {arrangedResult.percentage}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(Number(arrangedResult.percentage))}`}
                            style={{
                              width: `${Math.min(Number(arrangedResult.percentage), 100)}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeInfo?.bg} ${gradeInfo?.color} border ${gradeInfo?.border}`}>
                          {gradeInfo?.grade}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-purple-100 shadow-SM p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {arrangedResult.subjects.map((subject, idx) => {
                  const subjGrade = getGrade(Number(subject.percentage));
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${subjGrade.border} ${subjGrade.bg}`}>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {subject.subject_name}
                      </p>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {subject.marks_obtained}/{subject.max_marks}
                        </span>
                        <span
                          className={`text-sm font-bold ${subjGrade.color}`}>
                          {subjGrade.grade}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {viewMode === "students" &&
          students.length === 0 &&
          !loading &&
          selectedSession &&
          selectedClass &&
          selectedSection && (
            <div className="bg-white rounded-3xl border border-purple-100 shadow-SM p-12 text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Students Found
              </h3>
              <p className="text-gray-500">
                No students found for the selected filters. Please try different
                criteria.
              </p>
            </div>
          )}

        {viewMode === "tests" && unitTests.length === 0 && !loading && (
          <div className="bg-white rounded-3xl border border-purple-100 shadow-SM p-12 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Unit Tests
            </h3>
            <p className="text-gray-500">
              No unit tests available for this student.
            </p>
          </div>
        )}
      </div>
      {/* edit modal is here  */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}

            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Edit Student Marks</h2>

                  <p className="text-purple-100 text-sm mt-1">
                    Update marks for this subject
                  </p>
                </div>

                <button
                  onClick={() => setEditModal(false)}
                  className="
              w-10
              h-10
              rounded-xl
              bg-white/10
              hover:bg-white/20
              flex
              items-center
              justify-center
            ">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}

            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Subject
                </label>

                <input
                  value={editMark.subject_name}
                  disabled
                  className="
              w-full
              border
              border-gray-200
              rounded-xl
              p-3
              bg-gray-50
              text-gray-700
            "
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Marks Obtained
                </label>

                <input
                  type="number"
                  value={editMark.marks_obtained}
                  onChange={(e) =>
                    setEditMark({
                      ...editMark,
                      marks_obtained: e.target.value,
                    })
                  }
                  className="
              w-full
              border
              border-purple-200
              rounded-xl
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-purple-200
              focus:border-purple-500
            "
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Maximum Marks
                </label>

                <input
                  value={editMark.max_marks}
                  disabled
                  className="
              w-full
              border
              border-gray-200
              rounded-xl
              p-3
              bg-gray-50
              text-gray-700
            "
                />
              </div>

              {/* Preview */}

              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wide text-purple-500 mb-2">
                  Preview
                </p>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Percentage</span>

                  <span className="text-lg font-bold text-purple-700">
                    {editMark.max_marks
                      ? (
                          (Number(editMark.marks_obtained || 0) /
                            Number(editMark.max_marks)) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setEditModal(false)}
                className="
            px-5
            py-2.5
            rounded-xl
            border
            border-gray-200
            text-gray-700
            hover:bg-gray-100
          ">
                Cancel
              </button>

              <button
                onClick={handleUpdateMark}
                className="
            flex
            items-center
            gap-2
            px-5
            py-2.5
            rounded-xl
            bg-purple-600
            hover:bg-purple-700
            text-white
            font-medium
            shadow-lg
          ">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultFilter;
