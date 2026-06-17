import { useEffect } from "react";
import useMarksEntryStore from "../../store/marksEntryStore";

export default function EnterMarks() {
  const {
    sessions,
    classes,
    sections,
    unitTests,
    subjects,
    students,
    selectedSession,
    selectedClass,
    selectedSection,
    selectedUnitTest,
    selectedSubject,
    marks,
    loading,
    error,
    success,
    fetchInitialData,
    setSelectedSession,
    setSelectedClass,
    setSelectedSection,
    setSelectedUnitTest,
    setSelectedSubject,
    setMark,
    submitMarks,
  } = useMarksEntryStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Calculate progress stats
  const filledCount = Object.values(marks).filter(
    (m) => m !== "" && m !== undefined,
  ).length;
  const totalStudents = students.length;
  const progressPercent =
    totalStudents > 0 ? Math.round((filledCount / totalStudents) * 100) : 0;

  // Check if all required selections are made
  const isFormComplete =
    selectedSession &&
    selectedClass &&
    selectedSection &&
    selectedUnitTest &&
    selectedSubject;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter Marks</h1>
          <p className="text-gray-600">Record student marks for unit tests</p>
        </div>

        {/* Selection Cards */}
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Test Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                value={selectedClass?.class_id || ""}
                onChange={(e) => {
                  const c = classes.find((c) => c.class_id == e.target.value);
                  setSelectedClass(c);
                }}
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.name}
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                disabled={!selectedClass}
                value={selectedSection?.section_id || ""}
                onChange={(e) => {
                  const sec = sections.find(
                    (s) => s.section_id == e.target.value,
                  );
                  setSelectedSection(sec);
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                disabled={!selectedSession}
                value={selectedUnitTest?.test_id || ""}
                onChange={(e) => {
                  const ut = unitTests.find((u) => u.test_id == e.target.value);
                  setSelectedUnitTest(ut);
                }}
              >
                <option value="">Select Unit Test</option>
                {unitTests.map((u) => (
                  <option key={u.test_id} value={u.test_id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                disabled={!selectedClass}
                value={selectedSubject?.subject_id || ""}
                onChange={(e) => {
                  const sub = subjects.find(
                    (s) => s.subject_id == e.target.value,
                  );
                  setSelectedSubject(sub);
                }}
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Marks Display */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Maximum Marks
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span className="font-semibold text-lg">
                  {selectedUnitTest?.max_marks || "--"}
                </span>
                <span className="text-sm text-gray-500">marks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Entry Section */}
        {students.length > 0 && selectedSubject && selectedUnitTest ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header with Info */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Student Marks Entry
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Enter marks out of{" "}
                  <span className="font-semibold text-amber-600">
                    {selectedUnitTest.max_marks}
                  </span>
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700">
                    {filledCount}/{totalStudents}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">completed</span>
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-blue-600 w-10 text-right">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                      S.No
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      Roll No
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                      Marks Obtained
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student, index) => {
                    const markValue = marks[student.student_id];
                    const isFilled =
                      markValue !== "" && markValue !== undefined;
                    const isValid =
                      isFilled &&
                      Number(markValue) <= selectedUnitTest.max_marks;

                    return (
                      <tr
                        key={student.student_id}
                        className={`hover:bg-blue-50 transition-colors ${isFilled ? "bg-green-50/30" : ""}`}
                      >
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                              {student.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600 text-center">
                          {student.roll_no || "--"}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max={selectedUnitTest.max_marks}
                              className={`w-24 text-center border-2 rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all
                                ${
                                  !isFilled
                                    ? "border-gray-200 bg-gray-50 text-gray-400 focus:border-blue-500 focus:bg-white focus:text-gray-900"
                                    : isValid
                                      ? "border-green-300 bg-green-50 text-green-700"
                                      : "border-red-300 bg-red-50 text-red-700"
                                }`}
                              value={markValue || ""}
                              placeholder="--"
                              onChange={(e) => {
                                const val = e.target.value;
                                if (
                                  val === "" ||
                                  (Number(val) >= 0 &&
                                    Number(val) <= selectedUnitTest.max_marks)
                                ) {
                                  setMark(student.student_id, val);
                                }
                              }}
                            />
                            <span className="text-sm text-gray-400 font-medium">
                              / {selectedUnitTest.max_marks}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          {isFilled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Done
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    <svg
                      className="w-5 h-5"
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
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Marks saved successfully!
                    </span>
                  </div>
                )}
              </div>

              <button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all flex items-center justify-center gap-2"
                disabled={loading || filledCount === 0}
                onClick={submitMarks}
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
                    Saving...
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Submit Marks
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isFormComplete
                ? "No Students Found"
                : "Complete the Configuration"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {isFormComplete
                ? "No students are available for the selected class and section. Please check your selection."
                : "Please select all the required fields above (Session, Class, Section, Unit Test, and Subject) to view the student list."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
