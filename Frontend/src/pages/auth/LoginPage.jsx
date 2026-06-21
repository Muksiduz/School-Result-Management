import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { loginUser } from "../../services/authService";
import { School, GraduationCap, ClipboardList, Users } from "lucide-react";

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
    <div className="min-h-screen bg-purple-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col flex-1 bg-purple-600 relative overflow-hidden p-14 justify-between">
        {/* Background decoration circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-700 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40" />
        <div className="absolute top-1/2 right-12 w-40 h-40 bg-purple-400 rounded-full opacity-20" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <School size={18} className="text-purple-600" />
          </div>
          <span className="text-white font-semibold text-lg">Exademy</span>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-tight mb-5">
            School Result
            <br />
            Management
            <br />
            System
          </h1>
          <p className="text-purple-200 text-base leading-relaxed max-w-sm mb-10">
            Manage students, classes, exams, and results from a single modern
            dashboard.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: Users, label: "Student Management" },
              { icon: ClipboardList, label: "Exam & Result Processing" },
              { icon: GraduationCap, label: "Academic Session Tracking" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-purple-300 text-xs">
            © 2026 ia Academy · Secure Academic ERP
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-purple-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
              <School size={16} className="text-white" />
            </div>
            <span className="text-gray-800 font-semibold">Exademy</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <School size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome back
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-medium text-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Secure access · School Result Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
