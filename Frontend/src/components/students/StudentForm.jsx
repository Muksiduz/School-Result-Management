function StudentForm() {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-6">Student Information</h2>

      <div className="grid grid-cols-2 gap-5">
        <input
          placeholder="Admission Number"
          className="border p-3 rounded-xl"
        />

        <input placeholder="First Name" className="border p-3 rounded-xl" />

        <input placeholder="Last Name" className="border p-3 rounded-xl" />

        <select className="border p-3 rounded-xl">
          <option>Male</option>
          <option>Female</option>
        </select>

        <input type="date" className="border p-3 rounded-xl" />

        <input placeholder="Father Name" className="border p-3 rounded-xl" />

        <input placeholder="Mother Name" className="border p-3 rounded-xl" />

        <input placeholder="Phone" className="border p-3 rounded-xl" />
      </div>

      <textarea
        placeholder="Address"
        className="
          border
          p-3
          rounded-xl
          w-full
          mt-5
        "
      />

      <button
        className="
          mt-5
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
        ">
        Save Student
      </button>
    </div>
  );
}

export default StudentForm;
