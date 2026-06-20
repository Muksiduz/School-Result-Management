import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { loginUser } from "../../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser(formData);

      console.log("LOGIN RESPONSE:", response);

      login(response.user, response.token);

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || error?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />

        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-20 text-white max-w-2xl">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
              S
            </div>
          </div>

          <h1 className="text-6xl font-bold leading-tight">
            School
            <br />
            Management
            <br />
            System
          </h1>

          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            Manage students, classes, exams, attendance and reports from a
            single modern dashboard.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Student Management
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Exam & Result Processing
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Attendance Tracking
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">Welcome Back</h2>

              <p className="text-slate-400 mt-2">Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Username
                  </label>

                  <input
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    className="
                    w-full
                    bg-white/5
                    border
                    border-white/10
                    rounded-2xl
                    px-4
                    py-3
                    text-white
                    placeholder:text-slate-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-transparent
                  "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>

                  <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className="
                    w-full
                    bg-white/5
                    border
                    border-white/10
                    rounded-2xl
                    px-4
                    py-3
                    text-white
                    placeholder:text-slate-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-transparent
                  "
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                  w-full
                  py-3.5
                  rounded-2xl
                  font-semibold
                  text-white
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  hover:from-blue-700
                  hover:to-indigo-700
                  transition-all
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                  shadow-lg
                  shadow-blue-500/25
                ">
                  {loading ? "Logging In..." : "Login"}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-slate-500 text-center">
                Secure access to your dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
