import { useState } from "react";
import { createUser } from "../../services/userService";

function CreateUser() {
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

      setFormData({
        name: "",
        username: "",
        password: "",
        role: "teacher",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Add User</h1>

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          border
          rounded-3xl
          p-8
          max-w-5xl
        ">
        <h2 className="text-2xl font-semibold mb-8">User Information</h2>

        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="
              border
              rounded-2xl
              p-4
            "
          />

          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
            className="
              border
              rounded-2xl
              p-4
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            className="
              border
              rounded-2xl
              p-4
            "
          />

          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value,
              })
            }
            className="
              border
              rounded-2xl
              p-4
            ">
            <option value="admin">Admin</option>

            <option value="teacher">Teacher</option>

            <option value="viewer">Viewer</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="
            mt-8
            bg-blue-600
            text-white
            px-8
            py-4
            rounded-2xl
          ">
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
