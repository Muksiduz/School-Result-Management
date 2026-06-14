import { useState } from "react";
import { createClass } from "../../services/classService";

function ClassForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createClass({ name });

      alert("Class Created Successfully");

      setName("");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        p-6
        rounded-xl
        border
      ">
      <h2 className="text-xl font-semibold mb-6">Create Class</h2>

      <input
        type="text"
        placeholder="Class Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="
          w-full
          border
          p-3
          rounded-xl
          mb-5
        "
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
          hover:bg-blue-700
          disabled:opacity-50
        ">
        {loading ? "Saving..." : "Save Class"}
      </button>
    </form>
  );
}

export default ClassForm;
