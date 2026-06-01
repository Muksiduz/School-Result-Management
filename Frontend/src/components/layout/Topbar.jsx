import { Search, Bell, ChevronDown, Menu } from "lucide-react";

function Topbar({ toggleSidebar }) {
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

      {/* Center Search */}

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

        <div
          className="
            flex
            items-center
            gap-3
            cursor-pointer
          ">
          <img
            src="https://i.pravatar.cc/40"
            alt=""
            className="
              w-10
              h-10
              rounded-full
            "
          />

          <div>
            <h3 className="font-medium">Admin</h3>

            <p className="text-xs text-gray-500">Administrator</p>
          </div>

          <ChevronDown size={18} />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
