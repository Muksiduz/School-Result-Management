import React, { useEffect, useMemo } from "react";
import useViewClassResultStore from "../../store/viewClassResultStore";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ClassResultPage = () => {
  const {
    sessions,
    classes,
    sections,
    unitTest,
    results,
    selectedSession,
    selectedClass,
    selectedSection,
    selectedUnitTest,
    error,
    loading,
    initialFetch,
    setSelectedSession,
    setSelectedClass,
    setSelectedSection,
    setSelectedUnitTest,
    fetchFullClassResults,
  } = useViewClassResultStore();

  useEffect(() => {
    initialFetch();
  }, []);

  const arrangedResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    const studentMap = new Map();

    results.forEach((item) => {
      const studentId = item.student_id;
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          student_id: item.student_id,
          student_name: item.student_name,
          test_name: item.test_name,

          //changed
          roll_number: item.roll_number,
          subjects: [],
          total_marks_obtained: 0,
          total_max_marks: 0,
        });
      }
      const student = studentMap.get(studentId);
      student.subjects.push({
        subject_name: item.subject_name,
        marks_obtained: Number(item.marks_obtained),
        max_marks: Number(item.max_marks),
        percentage: (
          (Number(item.marks_obtained) / Number(item.max_marks)) *
          100
        ).toFixed(1),
      });
      student.total_marks_obtained += Number(item.marks_obtained);
      student.total_max_marks += Number(item.max_marks);
    });
    return Array.from(studentMap.values()).map((student) => {
      const overallPercentage =
        (student.total_marks_obtained / student.total_max_marks) * 100;

      const failedSubjects = student.subjects.filter(
        (subject) => Number(subject.marks_obtained) < 30,
      );

      const isFailed = failedSubjects.length > 0;

      return {
        ...student,

        overall_percentage: overallPercentage.toFixed(2),

        grade: getGrade(overallPercentage),

        failedSubjects,

        resultStatus: isFailed ? "FAIL" : "PASS",

        isFailed,
      };
    });
  }, [results]);

  function getGrade(percentage) {
    if (percentage >= 90)
      return {
        grade: "A+",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    if (percentage >= 80)
      return {
        grade: "A",
        color: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    if (percentage >= 70)
      return {
        grade: "B+",
        color: "text-amber-700",
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
        color: "text-orange-700",
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
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  }

  function getProgressColor(percentage) {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-purple-500";
    if (percentage >= 40) return "bg-amber-400";
    return "bg-red-400";
  }

  const allSubjects = useMemo(() => {
    if (arrangedResults.length === 0) return [];
    return arrangedResults[0].subjects.map((s) => s.subject_name);
  }, [arrangedResults]);

  const isFormComplete =
    selectedSession && selectedClass && selectedSection && selectedUnitTest;

  const selectClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  const handleExportClassPDF = () => {
    if (arrangedResults.length === 0) {
      alert("No Results Found");
      return;
    }

    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const subjects = allSubjects;

    const rankedStudents = [...arrangedResults].sort(
      (a, b) => Number(b.overall_percentage) - Number(a.overall_percentage),
    );

    // ==========================
    // SUMMARY CALCULATIONS
    // ==========================
    const passCount = rankedStudents.filter((s) => !s.isFailed).length;
    const failCount = rankedStudents.filter((s) => s.isFailed).length;
    const avg =
      rankedStudents.reduce(
        (acc, curr) => acc + Number(curr.overall_percentage),
        0,
      ) / rankedStudents.length;
    const totalMaxMarks =
      rankedStudents.length > 0 ? rankedStudents[0].total_max_marks : 0;
    const topper = rankedStudents[0];

    const tableHead = [
      [
        "Rank",
        "Roll No",
        "Student Name",
        ...subjects,
        "Obtained",
        "Max Marks",
        "%",
        "Grade",
        "Result",
      ],
    ];

    const tableBody = rankedStudents.map((student, index) => [
      index + 1,
      student.roll_number || "-",
      student.student_name,
      ...subjects.map((subject) => {
        const subjectData = student.subjects.find(
          (s) => s.subject_name === subject,
        );
        return subjectData ? subjectData.marks_obtained : "-";
      }),
      student.total_marks_obtained,
      student.total_max_marks,
      `${student.overall_percentage}%`,
      student.grade.grade,
      student.isFailed ? "FAIL" : "PASS",
    ]);

    autoTable(doc, {
      startY: 65,
      head: tableHead,
      body: tableBody,
      theme: "grid",
      margin: { top: 70, left: 8, right: 8 },

      didDrawPage: (data) => {
        // ==========================
        // HEADER
        // ==========================
        doc.setFillColor(109, 40, 217);
        doc.rect(0, 0, pageWidth, 38, "F");

        // School name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(17);
        doc.setFont("helvetica", "bold");
        doc.text("TARANGAJHAR HIGH SCHOOL", pageWidth / 2, 14, {
          align: "center",
        });

        // Thin divider
        doc.setDrawColor(196, 181, 253);
        doc.setLineWidth(0.3);
        doc.line(20, 19, pageWidth - 20, 19);

        // Subtitle
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(221, 214, 254);
        doc.text("CLASS RESULT SHEET", pageWidth / 2, 27, { align: "center" });

        // Date — top right
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(196, 181, 253);
        doc.text(
          `${new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}`,
          pageWidth - 8,
          9,
          { align: "right" },
        );

        // Page number — top right
        doc.text(`Page ${data.pageNumber}`, pageWidth - 8, 34, {
          align: "right",
        });

        // ==========================
        // INFO BAR (page 1 only)
        // ==========================
        if (data.pageNumber === 1) {
          doc.setFillColor(250, 248, 255);
          doc.setDrawColor(221, 214, 254);
          doc.setLineWidth(0.4);
          doc.roundedRect(8, 50, pageWidth - 16, 10, 1.5, 1.5, "FD");

          const infoItems = [
            { label: "SESSION", value: selectedSession?.name || "-" },
            { label: "CLASS", value: selectedClass?.name || "-" },
            { label: "SECTION", value: selectedSection?.name || "-" },
            { label: "EXAM", value: selectedUnitTest?.name || "-" },
            { label: "TOTAL STUDENTS", value: String(rankedStudents.length) },
          ];

          const slotW = (pageWidth - 16) / infoItems.length;

          infoItems.forEach((item, i) => {
            const x = 8 + i * slotW + slotW / 2;

            doc.setFontSize(5.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(109, 40, 217);
            doc.text(item.label, x, 54, { align: "center" });

            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(30, 30, 30);
            doc.text(item.value, x, 58, { align: "center" });

            if (i < infoItems.length - 1) {
              doc.setDrawColor(221, 214, 254);
              doc.setLineWidth(0.3);
              doc.line(8 + (i + 1) * slotW, 51, 8 + (i + 1) * slotW, 60);
            }
          });
        }

        // ==========================
        // FOOTER
        // ==========================
        doc.setFillColor(109, 40, 217);
        doc.rect(0, pageHeight - 10, pageWidth, 10, "F");

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(196, 181, 253);
        doc.text(
          "This is a computer generated result sheet and does not require a physical stamp.",
          pageWidth / 2,
          pageHeight - 4,
          { align: "center" },
        );
      },

      didParseCell: (data) => {
        if (data.section === "body") {
          const student = rankedStudents[data.row.index];

          // FAIL rows
          if (student?.isFailed) {
            data.cell.styles.fillColor = [255, 237, 237];
            data.cell.styles.textColor = [185, 28, 28];
          }

          // Rank 1 — gold
          if (data.row.index === 0 && !student?.isFailed) {
            data.cell.styles.fillColor = [255, 251, 235];
            data.cell.styles.textColor = [120, 80, 0];
          }

          // Result column bold
          const lastCol = tableHead[0].length - 1;
          if (data.column.index === lastCol) {
            data.cell.styles.fontStyle = "bold";
          }
        }
      },

      headStyles: {
        fillColor: [109, 40, 217],
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
        fontSize: 7.5,
        cellPadding: 3.5,
      },

      bodyStyles: {
        halign: "center",
        fontSize: 7.5,
        cellPadding: 3,
      },

      alternateRowStyles: {
        fillColor: [250, 248, 255],
      },

      columnStyles: {
        0: { cellWidth: 11 },
        1: { cellWidth: 14 },
        2: { halign: "left", cellWidth: 36 },
      },
    });

    // ==========================
    // SUMMARY — same page if fits,
    // new page otherwise
    // ==========================
    let sy = doc.lastAutoTable.finalY + 10;

    if (sy > pageHeight - 60) {
      doc.addPage();
      sy = 48; // below header
    }

    // Section pill
    doc.setFillColor(109, 40, 217);
    doc.roundedRect(8, sy, 44, 6, 1.5, 1.5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text("RESULT SUMMARY", 30, sy + 4.2, { align: "center" });

    // Summary box
    doc.setFillColor(250, 248, 255);
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(0.4);
    doc.roundedRect(8, sy + 8, pageWidth - 16, 22, 2, 2, "FD");

    const summaryCols = [
      {
        label: "Total Students",
        value: String(rankedStudents.length),
        color: null,
      },
      { label: "Passed", value: String(passCount), color: [22, 163, 74] },
      {
        label: "Failed",
        value: String(failCount),
        color: failCount > 0 ? [220, 38, 38] : [30, 30, 30],
      },
      {
        label: "Pass %",
        value: `${((passCount / rankedStudents.length) * 100).toFixed(0)}%`,
        color: [22, 163, 74],
      },
      { label: "Max Marks", value: String(totalMaxMarks), color: null },
      { label: "Class Average", value: `${avg.toFixed(1)}%`, color: null },
      { label: "Top Scorer", value: topper?.student_name || "-", color: null },
      {
        label: "Top Score",
        value: `${topper?.overall_percentage || 0}%`,
        color: [109, 40, 217],
      },
    ];

    const sumColW = (pageWidth - 16) / summaryCols.length;

    summaryCols.forEach((col, i) => {
      const x = 8 + i * sumColW + sumColW / 2;

      doc.setFontSize(5.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(109, 40, 217);
      doc.text(col.label.toUpperCase(), x, sy + 14, { align: "center" });

      const [r, g, b] = col.color || [30, 30, 30];
      doc.setTextColor(r, g, b);
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text(col.value, x, sy + 24, { align: "center" });

      if (i < summaryCols.length - 1) {
        doc.setDrawColor(221, 214, 254);
        doc.setLineWidth(0.3);
        doc.line(
          8 + (i + 1) * sumColW,
          sy + 10,
          8 + (i + 1) * sumColW,
          sy + 28,
        );
      }
    });

    // ==========================
    // SIGNATURE
    // ==========================
    const signY = sy + 48;

    const signers = [
      { label: "Class Teacher", x: pageWidth * 0.18 },
      { label: "Headmaster", x: pageWidth * 0.5 },
      { label: "Principal", x: pageWidth * 0.82 },
    ];

    signers.forEach((sig) => {
      doc.setDrawColor(160, 160, 160);
      doc.setLineWidth(0.4);
      doc.line(sig.x - 24, signY, sig.x + 24, signY);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(sig.label, sig.x, signY + 5, { align: "center" });
    });

    // ==========================
    // PAGE NUMBERS (all pages)
    // ==========================
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(196, 181, 253);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 8, pageHeight - 4, {
        align: "right",
      });
    }

    // ==========================
    // SAVE
    // ==========================
    doc.save(
      `${selectedClass?.name || "Class"}-${selectedUnitTest?.name || "Result"}-Sheet.pdf`,
    );
  };
  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Home / Class Results</p>
        <h1 className="text-2xl font-semibold text-gray-800">Class Results</h1>
      </div>

      {/* Filter Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100 p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Filter Options
          </span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Session */}
          <div>
            <label className={labelClass}>Academic Session</label>
            <select
              className={selectClass}
              value={selectedSession?.session_id || ""}
              onChange={(e) => {
                const s = sessions.find((s) => s.session_id == e.target.value);
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

          {/* Class */}
          <div>
            <label className={labelClass}>Class</label>
            <select
              className={selectClass}
              value={selectedClass?.class_id || ""}
              onChange={(e) => {
                const s = classes.find((s) => s.class_id == e.target.value);
                setSelectedClass(s);
              }}>
              <option value="">Select Class</option>
              {classes.map((s) => (
                <option key={s.class_id} value={s.class_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className={labelClass}>Section</label>
            <select
              className={selectClass}
              value={selectedSection?.section_id || ""}
              onChange={(e) => {
                const s = sections.find((s) => s.section_id == e.target.value);
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

          {/* Unit Test */}
          <div>
            <label className={labelClass}>Unit Test</label>
            <select
              className={selectClass}
              value={selectedUnitTest?.test_id || ""}
              onChange={(e) => {
                const s = unitTest.find((s) => s.test_id == e.target.value);
                setSelectedUnitTest(s);
              }}>
              <option value="">Select Unit Test</option>
              {unitTest.map((s) => (
                <option key={s.test_id} value={s.test_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={fetchFullClassResults}
          disabled={!isFormComplete || loading}
          className="flex items-center gap-2 px-5 py-2.5  bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colorsdisabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors">
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading...
            </>
          ) : (
            "View Class Result"
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Results Table */}
      {arrangedResults.length > 0 && (
        <div className="bg-white/70 rounded-2xl border border-purple-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-700">
                {arrangedResults[0]?.test_name || "Class Result"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {arrangedResults.length} students · {allSubjects.length}{" "}
                subjects
              </p>
            </div>
            <div>
              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                Total: {arrangedResults.length}
              </span>
              <button
                onClick={handleExportClassPDF}
                disabled={arrangedResults.length === 0}
                className="
    ml-3
    px-5
    py-2.5
    bg-green-600
    hover:bg-green-700
    text-white
    rounded-xl
    disabled:opacity-50
  ">
                Export PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide sticky left-0 bg-white z-10 min-w-[160px]">
                    Student
                  </th>
                  {allSubjects.map((subject) => (
                    <th
                      key={subject}
                      className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-[120px]">
                      {subject}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-[90px]">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-[90px]">
                    %
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-[70px]">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {arrangedResults.map((student) => {
                  const gradeInfo = student.grade;
                  return (
                    <tr
                      key={student.student_id}
                      className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                      {/* Student */}
                      <td className="px-4 py-3 sticky left-0 bg-white z-10 border-r border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {student.student_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 whitespace-nowrap">
                              {student.student_name}
                            </p>
                            <div className="flex justify-start gap-10">
                              <p className="text-xs text-purple-600 font-medium">
                                Roll No: {student.roll_number || "-"}
                              </p>
                              <p className="text-xs text-purple-600 font-medium">
                                Student ID: {student.student_id || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject Marks */}
                      {allSubjects.map((subjectName) => {
                        const subject = student.subjects.find(
                          (s) => s.subject_name === subjectName,
                        );
                        return (
                          <td
                            key={subjectName}
                            className="px-4 py-3 text-center">
                            {subject ? (
                              <div className="space-y-1">
                                <div>
                                  <span
                                    className={`text-sm font-semibold ${Number(subject.percentage) >= 40 ? "text-gray-700" : "text-red-500"}`}>
                                    {subject.marks_obtained}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {" "}
                                    / {subject.max_marks}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1">
                                  <div
                                    className={`h-1 rounded-full ${getProgressColor(Number(subject.percentage))}`}
                                    style={{
                                      width: `${Math.min(Number(subject.percentage), 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Total */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {student.total_marks_obtained}
                        </span>
                        <span className="text-xs text-gray-400">
                          {" "}
                          / {student.total_max_marks}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="px-4 py-3 text-center">
                        <div className="space-y-1">
                          <span
                            className={`text-sm font-semibold ${gradeInfo.color}`}>
                            {student.overall_percentage}%
                          </span>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${getProgressColor(Number(student.overall_percentage))}`}
                              style={{
                                width: `${Math.min(Number(student.overall_percentage), 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${gradeInfo.bg} ${gradeInfo.color} ${gradeInfo.border}`}>
                          {gradeInfo.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {arrangedResults.length === 0 &&
        !loading &&
        results &&
        results.length === 0 && (
          <div className="bg-white/70 rounded-2xl border border-purple-100 p-12 text-center">
            <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              No Results Found
            </h3>
            <p className="text-sm text-gray-400">
              Select filters and click "View Class Result" to see the data.
            </p>
          </div>
        )}
    </div>
  );
};

export default ClassResultPage;
