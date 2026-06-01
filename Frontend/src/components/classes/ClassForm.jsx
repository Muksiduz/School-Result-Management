function ClassForm() {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-6">Create Class</h2>

      <div className="grid grid-cols-2 gap-5">
        <input
          type="text"
          placeholder="Class Name"
          className="
            border
            p-3
            rounded-xl
          "
        />

        <input
          type="number"
          placeholder="Number of Sections"
          className="
            border
            p-3
            rounded-xl
          "
        />
      </div>

      <button
        className="
          mt-5
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
        ">
        Save Class
      </button>
    </div>
  );
}

export default ClassForm;
