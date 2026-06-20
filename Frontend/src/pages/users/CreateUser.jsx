import { useState } from "react";
import { createUser } from "../../services/userService";
import { X, UserPlus } from "lucide-react";

function CreateUser({ onClose }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "teacher",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createUser(formData);
      alert(response.message);
      onClose?.();
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
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
          <h2 className="text-lg font-semibold text-gray-800">Add New User</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Fill in the details to create a user
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <form
        id="createUserForm"
        onSubmit={handleSubmit}
        className="px-6 py-5 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            User Information
          </span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>

        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            type="text"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Username *</label>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Password *</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className={inputClass}>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="viewer">Viewer</option>
          </select>
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
          form="createUserForm"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
          <UserPlus size={15} />
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </>
  );
}

export default CreateUser;
