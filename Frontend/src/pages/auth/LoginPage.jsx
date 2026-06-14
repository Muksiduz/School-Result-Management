import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      login(data.user, data.token);

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      ">
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          w-[400px]
        ">
        <h1
          className="
            text-3xl
            font-bold
            mb-6
            text-center
          ">
          Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="
            w-full
            border
            p-3
            rounded-xl
            mb-4
          "
          value={formData.username}
          onChange={(e) =>
            setFormData({
              ...formData,
              username: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="
            w-full
            border
            p-3
            rounded-xl
            mb-6
          "
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-blue-600
            text-white
            p-3
            rounded-xl
            hover:bg-blue-700
            transition
          ">
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
