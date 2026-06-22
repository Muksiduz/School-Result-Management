import { useEffect, useState } from "react";
import useMarksEntryAllStore from "./marksEntryAllStore.js";
import { Search, Users, BookOpen, ChevronDown } from "lucide-react";

export default function EnterMarksAll() {
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
    selectedStudent,
    marks,
    loading,
    error,
    success,
    fetchInitialData,
    setSelectedSession,
    setSelectedClass,
    setSelectedSection,
    setSelectedUnitTest,
    setSelectedStudent,
    setMark,
    submitMarks,
  } = useMarksEntryAllStore();

  const [studentSearch, setStudentSearch] = useState("");
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredStudents = students.filter((s) => {
    const term = studentSearch.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) || String(s.roll_no).includes(term)
    );
  });

  const filledCount = subjects.filter(
    (sub) =>
      marks[sub.subject_id] !== "" && marks[sub.subject_id] !== undefined,
  ).length;
  const totalSubjects = subjects.length;
  const progressPercent =
    totalSubjects > 0 ? Math.round((filledCount / totalSubjects) * 100) : 0;

  const isFormComplete =
    selectedSession && selectedClass && selectedSection && selectedUnitTest;

  const selectClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Home / Marks Entry</p>
        <h1 className="text-2xl font-semibold text-gray-800">
          Enter Marks — All Subjects
        </h1>
      </div>

      {/* Configuration Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100 p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Test Configuration
          </span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>

        {/* Max Marks pill */}
        {selectedUnitTest && (
          <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2">
            <span className="text-xs font-semibold text-purple-500">
              Max Marks per Subject:
            </span>
            <span className="text-base font-bold text-purple-700">
              {selectedUnitTest.max_marks}
            </span>
          </div>
        )}
      </div>

      {/* Split View */}
      {students.length > 0 && selectedUnitTest ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Student List Panel ── */}
          <div className="lg:col-span-1 bg-white/70 rounded-2xl border border-purple-100 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-purple-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Students
                </span>
              </div>
              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                {students.length}
              </span>
            </div>

            {/* Search + Dropdown */}
            <div className="px-3 py-3 border-b border-gray-100">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or roll no..."
                  value={studentSearch}
                  onFocus={() => setStudentDropdownOpen(true)}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setStudentDropdownOpen(true);
                  }}
                  className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
                <ChevronDown
                  size={13}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${studentDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Dropdown list */}
              {studentDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setStudentDropdownOpen(false)}
                  />
                  <div className="absolute z-20 mt-1 w-full max-w-xs bg-white border border-purple-100 rounded-xl shadow-lg overflow-hidden">
                    <div className="max-h-52 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div
                            key={student.student_id}
                            onClick={() => {
                              setSelectedStudent(student);
                              setStudentSearch(student.name);
                              setStudentDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                              selectedStudent?.student_id === student.student_id
                                ? "bg-purple-50"
                                : "hover:bg-gray-50"
                            }`}>
                            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                              {student.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                Roll #{student.roll_no}
                              </p>
                            </div>
                            {selectedStudent?.student_id ===
                              student.student_id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-sm text-gray-400">
                          No students found
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Student list (scrollable) */}
            <div className="flex-1 overflow-y-auto">
              {students.map((student) => {
                const isSelected =
                  selectedStudent?.student_id === student.student_id;
                return (
                  <div
                    key={student.student_id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setStudentSearch(student.name);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 transition-colors ${
                      isSelected
                        ? "bg-purple-50 border-l-2 border-l-purple-500"
                        : "hover:bg-gray-50/50"
                    }`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                      {student.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          isSelected
                            ? "font-semibold text-purple-700"
                            : "font-medium text-gray-700"
                        }`}>
                        {student.name}
                      </p>
                      <div className="flex justify-start gap-8">
                        <p className="text-xs text-gray-400">
                          Student ID : #{student.student_id}
                        </p>
                        <p className="text-xs text-gray-400">
                          Roll No : {student.roll_no}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Marks Entry Panel ── */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="bg-white/70 rounded-2xl border border-purple-100 overflow-hidden">
                {/* Panel header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold">
                        {selectedStudent.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <h2 className="text-base font-semibold text-gray-800">
                        {selectedStudent.name}
                      </h2>
                      <span className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-md font-medium">
                        Roll #{selectedStudent.roll_no}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 ml-9">
                      {selectedUnitTest.name} · Max{" "}
                      <span className="font-semibold text-purple-600">
                        {selectedUnitTest.max_marks}
                      </span>{" "}
                      marks per subject
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        {filledCount}
                      </span>
                      /{totalSubjects}
                    </span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
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

                {/* Subjects table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Max Marks
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
                      {subjects.map((sub) => {
                        const markValue = marks[sub.subject_id];
                        const isFilled =
                          markValue !== "" && markValue !== undefined;
                        const isValid =
                          isFilled &&
                          Number(markValue) <= selectedUnitTest.max_marks &&
                          Number(markValue) >= 0;

                        return (
                          <tr
                            key={sub.subject_id}
                            className={`border-b border-gray-50 transition-colors ${
                              isFilled
                                ? "bg-green-50/20"
                                : "hover:bg-purple-50/20"
                            }`}>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                                  <BookOpen size={13} />
                                </div>
                                <span className="font-medium text-gray-700">
                                  {sub.name}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-3 text-center">
                              <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-md">
                                {selectedUnitTest.max_marks}
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
                                    let value = Number(e.target.value);

                                    if (e.target.value === "") {
                                      setMark(sub.subject_id, "");
                                      return;
                                    }

                                    if (value < 0) value = 0;

                                    if (value > selectedUnitTest.max_marks) {
                                      value = selectedUnitTest.max_marks;
                                    }

                                    setMark(sub.subject_id, value);
                                  }}
                                  className={`w-20 text-center border rounded-xl px-3 py-1.5 text-sm font-semibold outline-none transition-all focus:ring-2 ${
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
                      <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-xl">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-sm text-green-600 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                        Marks saved successfully!
                      </div>
                    )}
                  </div>
                  <button
                    disabled={loading || filledCount === 0}
                    onClick={submitMarks}
                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors">
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
                        Saving...
                      </>
                    ) : (
                      "Submit Marks"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white/70 rounded-2xl border border-purple-100 h-full min-h-64 flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={24} className="text-purple-300" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 mb-1">
                    No Student Selected
                  </h3>
                  <p className="text-sm text-gray-400">
                    Select a student from the list to enter marks
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : isFormComplete && students.length === 0 && !loading ? (
        /* No students found */
        <div className="bg-white/70 rounded-2xl border border-purple-100 p-12 text-center">
          <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-purple-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            No Students Found
          </h3>
          <p className="text-sm text-gray-400">
            No students available for the selected class and section.
          </p>
        </div>
      ) : !isFormComplete ? (
        /* Prompt to configure */
        <div className="bg-white/70 rounded-2xl border border-purple-100 p-12 text-center">
          <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-purple-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            Complete the Configuration
          </h3>
          <p className="text-sm text-gray-400">
            Select Session, Class, Section, and Unit Test above to load
            students.
          </p>
        </div>
      ) : null}
    </div>
  );
}
