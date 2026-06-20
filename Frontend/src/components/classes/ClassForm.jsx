import { useState } from "react";
import { createClass } from "../../services/classService";
import { X, Plus, School } from "lucide-react";

function ClassForm({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createClass({ name });
      alert("Class Created Successfully");
      setName("");
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Add New Class</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Create a new class record
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <form id="classForm" onSubmit={handleSubmit} className="px-6 py-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Class Details
          </span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>

        <div>
          <label className={labelClass}>Class Name *</label>
          <input
            type="text"
            placeholder="e.g. Class 7"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>
      </form>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          form="classForm"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus size={15} />
          {loading ? "Saving..." : "Save Class"}
        </button>
      </div>
    </>
  );
}

export default ClassForm;
