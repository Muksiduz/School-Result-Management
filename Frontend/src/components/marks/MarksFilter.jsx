function MarksFilter() {
  return (
    <div className="bg-white border rounded-xl p-5">
      <h2 className="font-semibold text-lg mb-4">Select Exam</h2>

      <div className="grid grid-cols-5 gap-4">
        <select className="border p-3 rounded-xl">
          <option>Session</option>
          <option>2025-2026</option>
        </select>

        <select className="border p-3 rounded-xl">
          <option>Class</option>
          <option>Class 6</option>
          <option>Class 7</option>
        </select>

        <select className="border p-3 rounded-xl">
          <option>Section</option>
          <option>A</option>
          <option>B</option>
        </select>

        <select className="border p-3 rounded-xl">
          <option>Exam</option>
          <option>Unit Test 1</option>
          <option>Half Yearly</option>
        </select>

        <button
          className="
            bg-blue-600
            text-white
            rounded-xl
          ">
          Load Students
        </button>
      </div>
    </div>
  );
}

export default MarksFilter;
