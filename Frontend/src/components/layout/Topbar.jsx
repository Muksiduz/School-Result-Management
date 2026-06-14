import { useState } from "react";
import { Search, Bell, ChevronDown, Menu, LogOut } from "lucide-react";

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

  return (
    <header
      className="
        h-20
        bg-white
        border-b
        border-gray-200
        flex
        items-center
        justify-between
        px-6
      ">
      {/* Left */}

      <div className="flex items-center gap-5">
        <button
          onClick={toggleSidebar}
          className="
            p-2
            rounded-lg
            hover:bg-gray-100
          ">
          <Menu size={22} />
        </button>

        <div>
          <h1 className="font-bold text-xl text-blue-600">
            School Result Management
          </h1>

          <p className="text-xs text-gray-500">Academic ERP System</p>
        </div>
      </div>

      {/* Search */}

      <div className="relative w-[500px]">
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search students, exams, results..."
          className="
            w-full
            pl-11
            py-3
            rounded-xl
            border
            border-gray-200
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">
        {/* Notifications */}

        <button className="relative">
          <Bell size={22} />

          <span
            className="
              absolute
              -top-2
              -right-2
              w-5
              h-5
              bg-blue-600
              text-white
              rounded-full
              text-xs
              flex
              items-center
              justify-center
            ">
            3
          </span>
        </button>

        {/* User Dropdown */}

        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="
              flex
              items-center
              gap-3
              cursor-pointer
              hover:bg-gray-100
              px-3
              py-2
              rounded-lg
            ">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="
                w-10
                h-10
                rounded-full
              "
            />

            <div>
              <h3 className="font-medium">{user?.name || "Admin"}</h3>

              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "Administrator"}
              </p>
            </div>

            <ChevronDown size={18} />
          </div>

          {open && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-2
                w-52
                bg-white
                border
                rounded-xl
                shadow-lg
                overflow-hidden
                z-50
              ">
              <div className="px-4 py-3 border-b">
                <h4 className="font-medium">{user?.name}</h4>

                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>

              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-red-600
                  hover:bg-red-50
                  transition-colors
                ">
                <LogOut size={18} />

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
