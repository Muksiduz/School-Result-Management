import { useState } from "react";
import { ChevronDown, Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

function Topbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-purple-50 hover:text-purple-600 text-gray-500 transition-colors">
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-semibold text-gray-800 text-sm leading-tight">
            School Result Management
          </h1>
          <p className="text-xs text-gray-400">Academic ERP System</p>
        </div>
      </div>

      {/* Right — User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role || "Administrator"}
            </p>
          </div>
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-100 overflow-hidden z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400">@{user?.username}</p>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;
