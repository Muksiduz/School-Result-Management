import { useEffect } from "react";
import useMarksEntryAllStore from "./marksEntryAllStore.js";

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

  useEffect(() => {
    fetchInitialData();
  }, []);

  console.log(students);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enter Marks</h1>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedSession?.session_id || ""}
          onChange={(e) => {
            const s = sessions.find((s) => s.session_id == e.target.value);
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

        <select
          className="border p-2 rounded"
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

        <select
          className="border p-2 rounded"
          disabled={!selectedClass}
          value={selectedSection?.section_id || ""}
          onChange={(e) => {
            const sec = sections.find((s) => s.section_id == e.target.value);
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

        <select
          className="border p-2 rounded"
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

      {/* Split view */}
      {students.length > 0 && selectedUnitTest && (
        <div className="grid grid-cols-3 gap-4">
          {/* Student list */}
          <div className="col-span-1 border rounded overflow-hidden">
            <div className="bg-gray-100 p-2 font-semibold text-sm">
              Students
            </div>
            <ul className="divide-y">
              {students.map((student) => (
                <li
                  key={student.student_id}
                  className={`p-3 cursor-pointer hover:bg-blue-50 text-sm ${selectedStudent?.student_id === student.student_id ? "bg-blue-100 font-semibold" : ""}`}
                  onClick={() => setSelectedStudent(student)}
                >
                  {student.name}<br/>
                  {student.student_id}<br/>
                  {student.roll_no}
                  {}
                </li>
              ))}
            </ul>
          </div>

          {/* Marks entry */}
          <div className="col-span-2">
            {selectedStudent ? (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  {selectedStudent.name} — {selectedUnitTest.name}
                </h2>

                <table className="w-full border rounded text-sm mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Subject</th>
                      <th className="p-2 text-center">Max Marks</th>
                      <th className="p-2 text-center">Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {subjects.map((sub) => (
                      <tr key={sub.subject_id}>
                        <td className="p-2">{sub.name}</td>
                        <td className="p-2 text-center">
                          {selectedUnitTest.max_marks}
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max={selectedUnitTest.max_marks}
                            className="border rounded p-1 w-20 text-center"
                            value={marks[sub.subject_id] || ""}
                            onChange={(e) =>
                              setMark(sub.subject_id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && (
                  <p className="text-green-500 mb-2">
                    Marks saved successfully!
                  </p>
                )}

                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50"
                  disabled={loading}
                  onClick={submitMarks}
                >
                  {loading ? "Saving..." : "Submit Marks"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a student to enter marks
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
