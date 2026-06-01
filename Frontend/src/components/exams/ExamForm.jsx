function ExamForm() {
  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Create Exam</h2>

      <div className="grid grid-cols-2 gap-5">
        <input
          type="text"
          placeholder="Exam Name"
          className="border p-3 rounded-xl"
        />

        <select className="border p-3 rounded-xl">
          <option>Select Session</option>
          <option>2024-2025</option>
          <option>2025-2026</option>
        </select>

        <select className="border p-3 rounded-xl">
          <option>Select Exam Type</option>
          <option>Unit Test</option>
          <option>Half Yearly</option>
          <option>Annual</option>
        </select>

        <input type="date" className="border p-3 rounded-xl" />

        <input type="date" className="border p-3 rounded-xl" />
      </div>

      <button
        className="
          mt-6
          bg-blue-600
          text-white
          px-6
          py-3
          rounded-xl
        ">
        Save Exam
      </button>
    </div>
  );
}

export default ExamForm;
