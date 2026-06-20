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

  const filledCount = Object.values(marks).filter(
    (m) => m !== "" && m !== undefined,
  ).length;
  const totalStudents = students.length;
  const progressPercent =
    totalStudents > 0 ? Math.round((filledCount / totalStudents) * 100) : 0;

  const isFormComplete =
    selectedSession &&
    selectedClass &&
    selectedSection &&
    selectedUnitTest &&
    selectedSubject;

  const selectClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Home / Marks Entry</p>
        <h1 className="text-2xl font-semibold text-gray-800">Enter Marks</h1>
      </div>

      {/* Configuration Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100 p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Test Configuration
          </span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Section */}
          <div>
            <label className={labelClass}>Section</label>
            <select
              className={selectClass}
              disabled={!selectedClass}
              value={selectedSection?.section_id || ""}
              onChange={(e) => {
                const sec = sections.find(
                  (s) => s.section_id == e.target.value,
                );
                setSelectedSection(sec);
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
              disabled={!selectedSession}
              value={selectedUnitTest?.test_id || ""}
              onChange={(e) => {
                const ut = unitTests.find((u) => u.test_id == e.target.value);
                setSelectedUnitTest(ut);
              }}>
              <option value="">Select Unit Test</option>
              {unitTests.map((u) => (
                <option key={u.test_id} value={u.test_id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className={labelClass}>Subject</label>
            <select
              className={selectClass}
              disabled={!selectedClass}
              value={selectedSubject?.subject_id || ""}
              onChange={(e) => {
                const sub = subjects.find(
                  (s) => s.subject_id == e.target.value,
                );
                setSelectedSubject(sub);
              }}>
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Marks */}
          <div>
            <label className={labelClass}>Maximum Marks</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-purple-50 border border-purple-100 rounded-xl">
              <span className="text-lg font-semibold text-purple-700">
                {selectedUnitTest?.max_marks || "—"}
              </span>
              <span className="text-xs text-gray-400">marks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Entry Table */}
      {students.length > 0 && selectedSubject && selectedUnitTest ? (
        <div className="bg-white/70 rounded-2xl border border-purple-100 overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-700">
                Student Marks Entry
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Enter marks out of{" "}
                <span className="font-semibold text-purple-600">
                  {selectedUnitTest.max_marks}
                </span>
              </p>
            </div>
            {/* Progress */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{filledCount}</span>
                /{totalStudents} filled
              </span>
              <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-purple-600 w-9 text-right">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-12">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Marks Obtained
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const markValue = marks[student.student_id];
                  const isFilled = markValue !== "" && markValue !== undefined;
                  const isValid =
                    isFilled && Number(markValue) <= selectedUnitTest.max_marks;

                  return (
                    <tr
                      key={student.student_id}
                      className={`border-b border-gray-50 transition-colors ${isFilled ? "bg-green-50/30" : "hover:bg-purple-50/30"}`}>
                      <td className="px-6 py-3 text-gray-400 text-xs">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {student.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-gray-700">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-md">
                          {student.roll_no || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max={selectedUnitTest.max_marks}
                            placeholder="—"
                            value={markValue || ""}
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
                            className={`w-20 text-center border rounded-xl px-3 py-1.5 text-sm font-semibold outline-none transition-all focus:ring-2
                              ${
                                !isFilled
                                  ? "border-gray-200 bg-gray-50 text-gray-400 focus:border-purple-400 focus:ring-purple-100"
                                  : isValid
                                    ? "border-green-200 bg-green-50 text-green-700 focus:ring-green-100"
                                    : "border-red-200 bg-red-50 text-red-600 focus:ring-red-100"
                              }`}
                          />
                          <span className="text-xs text-gray-400">
                            / {selectedUnitTest.max_marks}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        {isFilled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            ✓ Done
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

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
            <div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-sm">
                  Marks saved successfully!
                </div>
              )}
            </div>
            <button
              disabled={loading || filledCount === 0}
              onClick={submitMarks}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors">
              {loading ? (
                <span className="flex items-center gap-2">
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
                  Saving...
                </span>
              ) : (
                "Submit Marks"
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            {isFormComplete
              ? "No Students Found"
              : "Complete the Configuration"}
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            {isFormComplete
              ? "No students are available for the selected class and section."
              : "Select all required fields above to view the student list."}
          </p>
        </div>
      )}
    </div>
  );
}
