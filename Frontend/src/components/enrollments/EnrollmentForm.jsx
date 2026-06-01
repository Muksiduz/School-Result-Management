function EnrollmentForm() {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-6">Create Enrollment</h2>

      <div className="grid grid-cols-3 gap-5">
        <select className="border p-3 rounded-xl">
          <option>Select Student</option>
          <option>Rahim Ali</option>
          <option>Riya Sharma</option>
        </select>

        <select className="border p-3 rounded-xl">
          <option>Select Session</option>
          <option>2024-2025</option>
          <option>2025-2026</option>
        </select>

        <select className="border p-3 rounded-xl">
          <option>Select Class</option>
          <option>Class 1</option>
          <option>Class 2</option>
          <option>Class 3</option>
          <option>Class 4</option>
          <option>Class 5</option>
          <option>Class 6</option>
          <option>Class 7</option>
          <option>Class 8</option>
          <option>Class 9</option>
          <option>Class 10</option>
        </select>

        <input placeholder="Section" className="border p-3 rounded-xl" />

        <input placeholder="Roll Number" className="border p-3 rounded-xl" />

        <select className="border p-3 rounded-xl">
          <option>ACTIVE</option>
          <option>PROMOTED</option>
          <option>PASSOUT</option>
          <option>ARCHIVED</option>
        </select>
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
        Save Enrollment
      </button>
    </div>
  );
}

export default EnrollmentForm;
