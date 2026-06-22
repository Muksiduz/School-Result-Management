import { useEffect, useState } from "react";
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

  // for edit marks modal
  const [editModal, setEditModal] = useState(false);

  //for filter roll no
  const [rollFilter, setRollFilter] = useState("");
  const filteredStudents = students.filter((student) =>
    student.roll_no
      ?.toString()
      .toLowerCase()
      .includes(rollFilter.toLowerCase()),
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

  console.log("Students:", students);

  const arrangedResult =
    fullResult?.length > 0
      ? {
          student_id: fullResult[0]?.student_id,
          student_name: fullResult[0]?.student_name,
          test_name: fullResult[0]?.test_name,
          class_name: fullResult[0]?.class_name,
          section_name: fullResult[0]?.section_name,
          Father_name: fullResult[0]?.father_name,
          roll_no: fullResult[0]?.roll_no,
          subjects: fullResult.map((r) => ({
            subject_id: r.subject_id,
            subject_name: r.subject_name,
            marks_obtained: Number(r.marks_obtained),
            max_marks: Number(r.max_marks),
            percentage: (
              (Number(r.marks_obtained) / Number(r.max_marks)) *
              100
            ).toFixed(1),
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
        }
      : null;

  //  console.log("Arrange Result::",arrangedResult);
  //  console.log(fullResult);
  const failedSubjects =
    arrangedResult?.subjects?.filter(
      (subject) => Number(subject.marks_obtained) < 30,
    ) || [];

  const isFailed = failedSubjects.length > 0;

  const resultStatus = isFailed ? "FAIL" : "PASS";

  const getGrade = (percentage) => {
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
        color: "text-yellow-600",
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
    if (percentage >= 40)
      return {
        grade: "D",
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    return {
      grade: "F",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  };

  const gradeInfo = arrangedResult
    ? isFailed
      ? {
          grade: "F",
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
        }
      : getGrade(Number(arrangedResult.percentage))
    : null;

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // export pdf function
  const handleExportPDF = () => {
    if (!arrangedResult) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const gradeInfo = getGrade(Number(arrangedResult.percentage));

    // ============================================================
    // PAGE BORDER
    // ============================================================
    doc.setDrawColor(109, 40, 217);
    doc.setLineWidth(1.5);
    doc.rect(6, 6, pageWidth - 12, pageHeight - 12);

    doc.setDrawColor(196, 181, 253);
    doc.setLineWidth(0.4);
    doc.rect(9, 9, pageWidth - 18, pageHeight - 18);

    // ============================================================
    // HEADER
    // ============================================================
    doc.setFillColor(109, 40, 217);
    doc.rect(6, 6, pageWidth - 12, 40, "F");

    // Generated date — top right
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(196, 181, 253);
    doc.text(
      `Date: ${new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      pageWidth - 12,
      12,
      { align: "right" },
    );

    // School name — centered
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("TARANGAJHAR HIGH SCHOOL", pageWidth / 2, 24, { align: "center" });

    // Thin divider
    doc.setDrawColor(196, 181, 253);
    doc.setLineWidth(0.3);
    doc.line(20, 30, pageWidth - 20, 30);

    // Report card label
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(221, 214, 254);
    doc.text("STUDENT ACADEMIC REPORT CARD", pageWidth / 2, 39, {
      align: "center",
    });

    // ============================================================
    // STUDENT INFO CARD
    // ============================================================
    doc.setFillColor(250, 248, 255);
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(0.4);
    doc.roundedRect(12, 52, pageWidth - 24, 52, 3, 3, "FD");

    // Section pill
    doc.setFillColor(109, 40, 217);
    doc.roundedRect(12, 52, 55, 7, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT INFORMATION", 39, 57, { align: "center" });

    // Vertical divider
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(0.4);
    doc.line(105, 56, 105, 100);

    const infoY = 67;
    const rowGap = 11;
    const labelX = 18;
    const valueX = 60;
    const labelX2 = 112;
    const valueX2 = 152;

    const leftRows = [
      { label: "Student Name", value: arrangedResult.student_name || "-" },
      { label: "Roll Number", value: String(arrangedResult.roll_no || "-") },
      { label: "Class", value: arrangedResult.class_name || "-" },
      { label: "Section", value: arrangedResult.section_name || "-" },
    ];

    const rightRows = [
      { label: "Examination", value: arrangedResult.test_name || "-" },
      // { label: "Session", value: selectedSession?.session_id || "-" },
      { label: "Grade", value: gradeInfo.grade },
      { label: "Result", value: resultStatus, isResult: true },
    ];

    leftRows.forEach((row, i) => {
      const y = infoY + i * rowGap;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(109, 40, 217);
      doc.text(row.label + " :", labelX, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(8.5);
      doc.text(row.value, valueX, y);
    });

    rightRows.forEach((row, i) => {
      const y = infoY + i * rowGap;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(109, 40, 217);
      doc.text(row.label + " :", labelX2, y);

      if (row.isResult) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(
          isFailed ? 220 : 34,
          isFailed ? 38 : 197,
          isFailed ? 38 : 94,
        );
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 30, 30);
      }
      doc.text(row.value, valueX2, y);
    });

    // ============================================================
    // SUBJECT TABLE HEADING
    // ============================================================
    doc.setFillColor(109, 40, 217);
    doc.roundedRect(12, 110, 70, 7, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("SUBJECT-WISE PERFORMANCE", 47, 115, { align: "center" });

    // ============================================================
    // SUBJECT TABLE
    // ============================================================
    autoTable(doc, {
      startY: 120,
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
      body: arrangedResult.subjects.map((subject, idx) => [
        idx + 1,
        subject.subject_name,
        subject.max_marks,
        subject.marks_obtained,
        `${subject.percentage}%`,
        getGrade(Number(subject.percentage)).grade,
        Number(subject.marks_obtained) < 30 ? "FAIL" : "PASS",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [109, 40, 217],
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
        fontSize: 8.5,
        cellPadding: 4,
      },
      bodyStyles: {
        halign: "center",
        fontSize: 8.5,
        textColor: [40, 40, 40],
        cellPadding: 3.5,
      },
      alternateRowStyles: {
        fillColor: [250, 248, 255],
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { halign: "left", cellWidth: 55 },
        6: { fontStyle: "bold" },
      },
      margin: { left: 12, right: 12 },
      didParseCell: (data) => {
        if (data.section === "body") {
          const rowSubject = arrangedResult.subjects[data.row.index];
          const subjectFailed = Number(rowSubject?.marks_obtained) < 30;
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
    // RESULT SUMMARY
    // ============================================================
    const finalY = doc.lastAutoTable.finalY + 8;

    // Section pill
    doc.setFillColor(109, 40, 217);
    doc.roundedRect(12, finalY, 50, 7, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("RESULT SUMMARY", 37, finalY + 5, { align: "center" });

    // Summary box
    doc.setFillColor(250, 248, 255);
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(0.4);
    doc.roundedRect(12, finalY + 9, pageWidth - 24, 24, 2, 2, "FD");

    const cols = [
      { label: "Max Marks", value: String(arrangedResult.total_max_marks) },
      {
        label: "Total Marks Obtained",
        value: String(arrangedResult.total_marks),
      },
      { label: "Percentage", value: `${arrangedResult.percentage}%` },
      { label: "Grade", value: gradeInfo.grade },
      { label: "Result", value: resultStatus },
    ];

    const colWidth = (pageWidth - 24) / cols.length;

    cols.forEach((col, i) => {
      const x = 12 + i * colWidth + colWidth / 2;
      const isResultCol = col.label === "Result";

      doc.setTextColor(109, 40, 217);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.text(col.label.toUpperCase(), x, finalY + 16, { align: "center" });

      if (isResultCol) {
        doc.setTextColor(
          isFailed ? 200 : 34,
          isFailed ? 0 : 197,
          isFailed ? 0 : 94,
        );
      } else {
        doc.setTextColor(30, 30, 30);
      }
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(col.value, x, finalY + 27, { align: "center" });

      if (i < cols.length - 1) {
        doc.setDrawColor(221, 214, 254);
        doc.setLineWidth(0.3);
        doc.line(
          12 + (i + 1) * colWidth,
          finalY + 11,
          12 + (i + 1) * colWidth,
          finalY + 31,
        );
      }
    });

    // ============================================================
    // PRINCIPAL SIGNATURE
    // ============================================================
    const signY = finalY + 54;

    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.4);
    doc.line(pageWidth - 70, signY, pageWidth - 18, signY);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Principal Signature", pageWidth - 44, signY + 6, {
      align: "center",
    });

    // ============================================================
    // FOOTER
    // ============================================================
    doc.setFillColor(109, 40, 217);
    doc.rect(6, pageHeight - 18, pageWidth - 12, 12, "F");

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(196, 181, 253);
    doc.text(
      "This is a computer generated report card and does not require a physical stamp.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" },
    );

    // ============================================================
    // SAVE
    // ============================================================
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
                      <p className="text-xs text-gray-500 mt-1">
                        Roll No: {student.roll_no || "-"}
                      </p>
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
                                {subject.subject_id}
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
