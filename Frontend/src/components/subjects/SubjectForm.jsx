function SubjectForm() {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-6">Create Subject</h2>

      <div className="grid grid-cols-2 gap-5">
        <input
          type="text"
          placeholder="Subject Name"
          className="
            border
            p-3
            rounded-xl
          "
        />

        <input
          type="text"
          placeholder="Subject Code"
          className="
            border
            p-3
            rounded-xl
          "
        />

        <select
          className="
            border
            p-3
            rounded-xl
          ">
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
        Save Subject
      </button>
    </div>
  );
}

export default SubjectForm;
