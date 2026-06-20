import React, { useEffect, useMemo } from "react";
import useViewClassResultStore from "../../store/viewClassResultStore";

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

  // Arrange results by student_id
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

    // Calculate overall percentage and add grade
    return Array.from(studentMap.values()).map((student) => ({
      ...student,
      overall_percentage: (
        (student.total_marks_obtained / student.total_max_marks) *
        100
      ).toFixed(2),
      grade: getGrade(
        (student.total_marks_obtained / student.total_max_marks) * 100,
      ),
    }));
  }, [results]);

  // Get grade based on percentage
  function getGrade(percentage) {
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
  }

  // Get progress bar color
  function getProgressColor(percentage) {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  }

  // Get all unique subject names for table headers
  const allSubjects = useMemo(() => {
    if (arrangedResults.length === 0) return [];
    return arrangedResults[0].subjects.map((s) => s.subject_name);
  }, [arrangedResults]);

  const isFormComplete =
    selectedSession && selectedClass && selectedSection && selectedUnitTest;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Class Results
          </h1>
          <p className="text-gray-600">
            View complete class performance report
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Session */}
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
                }}
              >
                <option value="">Select Session</option>
                {sessions.map((s) => (
                  <option key={s.session_id} value={s.session_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={selectedClass?.class_id || ""}
                onChange={(e) => {
                  const s = classes.find((s) => s.class_id == e.target.value);
                  setSelectedClass(s);
                }}
              >
                <option value="">Select Class</option>
                {classes.map((s) => (
                  <option key={s.class_id} value={s.class_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
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
                }}
              >
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s.section_id} value={s.section_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Test */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Unit Test
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={selectedUnitTest?.test_id || ""}
                onChange={(e) => {
                  const s = unitTest.find((s) => s.test_id == e.target.value);
                  setSelectedUnitTest(s);
                }}
              >
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
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
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
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                View Class Result
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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

        {/* Results Table */}
        {arrangedResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {arrangedResults[0]?.test_name || "Class Result"}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {arrangedResults.length} students • {allSubjects.length}{" "}
                  subjects
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-100 z-10">
                      Student
                    </th>
                    {allSubjects.map((subject) => (
                      <th
                        key={subject}
                        className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-30"
                      >
                        {subject}
                      </th>
                    ))}
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-25">
                      Total
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-25">
                      %
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-20">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {arrangedResults.map((student) => {
                    const gradeInfo = student.grade;
                    return (
                      <tr
                        key={student.student_id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        {/* Student Name */}
                        <td className="px-4 py-3 sticky left-0 bg-white hover:bg-blue-50 z-10 border-r border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                              {student.student_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2) || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                {student.student_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {student.student_id}
                              </p>
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
                              className="px-4 py-3 text-center"
                            >
                              {subject ? (
                                <div className="space-y-1">
                                  <span
                                    className={`text-sm font-semibold ${Number(subject.percentage) >= 40 ? "text-gray-900" : "text-red-600"}`}
                                  >
                                    {subject.marks_obtained}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {" "}
                                    / {subject.max_marks}
                                  </span>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full ${getProgressColor(Number(subject.percentage))}`}
                                      style={{
                                        width: `${Math.min(Number(subject.percentage), 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}

                        {/* Total Marks */}
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-bold text-gray-900">
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
                              className={`text-sm font-bold ${gradeInfo.color}`}
                            >
                              {student.overall_percentage}%
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(Number(student.overall_percentage))}`}
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
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${gradeInfo.bg} ${gradeInfo.color} border ${gradeInfo.border}`}
                          >
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-500">
                Select filters and click "View Class Result" to see the data.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default ClassResultPage;
