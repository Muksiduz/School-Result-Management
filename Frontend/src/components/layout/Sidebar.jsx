import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  School,
  BookOpen,
  Layers,
  ClipboardList,
  PencilLine,
  FileBarChart,
  Trophy,
} from "lucide-react";

function Sidebar({ isOpen }) {
  const location = useLocation();

  const [userOpen, setUserOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const [studentOpen, setStudentOpen] = useState(true);
  const [resultOpen, setResultOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 overflow-y-auto">
      <nav className="p-3 space-y-0.5">
        {/* Dashboard */}

        <MenuItem
          to="/"
          icon={<LayoutDashboard size={17} />}
          title="Dashboard"
          active={location.pathname === "/"}
        />

        {/* Users */}

        {user?.role === "admin" && (
          <MenuItem
            to="/users"
            icon={<Users size={17} />}
            title="Users"
            active={location.pathname === "/users"}
          />
        )}

        {/* Academic Session */}

        <MenuItem
          to="/sessions"
          icon={<CalendarDays size={17} />}
          title="Academic Sessions"
          active={location.pathname === "/sessions"}
        />

        {/* Classes */}

        <MenuItem
          to="/classes"
          icon={<School size={17} />}
          title="Classes"
          active={location.pathname === "/classes"}
        />

        {/* Sections */}

        <MenuItem
          to="/section"
          icon={<Layers size={17} />}
          title="Sections"
          active={location.pathname === "/section"}
        />

        {/* Subjects */}

        <MenuItem
          to="/subjects"
          icon={<BookOpen size={17} />}
          title="Subjects"
          active={location.pathname === "/subjects"}
        />

        {/* Exams */}

        <MenuItem
          to="/exams"
          icon={<ClipboardList size={17} />}
          title="Exams"
          active={location.pathname === "/exams"}
        />

        {/* Students */}

        <MenuItem
          to="/students"
          icon={<GraduationCap size={17} />}
          title="Students"
          active={location.pathname === "/students"}
        />

        {/* Marks */}

        <MenuItem
          to="/marks"
          icon={<PencilLine size={17} />}
          title="Marks Entry"
          active={location.pathname === "/marks"}
        />

        {/* Results */}

        <MenuItem
          to="/results"
          icon={<FileBarChart size={17} />}
          title="Student Results"
          active={location.pathname === "/results"}
        />

        {/* Class Results */}

        <MenuItem
          to="/class-results"
          icon={<Trophy size={17} />}
          title="Class Performance"
          active={location.pathname === "/class-results"}
        />

        {/* Old Sessions */}
        <MenuItem
          to="/old-sessions"
          icon={<Trophy size={17} />}
          title="Old Sessions"
          active={location.pathname === "/old-sessions"}
        />
      </nav>
    </aside>
  );
}

/* -------------------------- */
/* Menu Item */
/* -------------------------- */

function MenuItem({ to, icon, title, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
        active
          ? "bg-purple-50 text-purple-600 font-medium border-l-2 border-purple-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
      }`}>
      {icon}
      <span>{title}</span>
    </Link>
  );
}

/* -------------------------- */
/* Dropdown */
/* -------------------------- */

function DropdownButton({ title, icon, open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </div>
      {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
    </button>
  );
}

/* -------------------------- */
/* Sub Menu */
/* -------------------------- */

function SubMenuItem({ to, title, active }) {
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "text-purple-600 bg-purple-50 font-medium"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
      }`}>
      {title}
    </Link>
  );
}

export default Sidebar;
