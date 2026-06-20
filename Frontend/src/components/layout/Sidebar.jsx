import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import {
  LayoutDashboard,
  Users,
  Calendar,
  School,
  BookOpen,
  ClipboardList,
  FileText,
  PencilLine,
  BarChart3,
  Search,
  DatabaseBackup,
  Settings,
  ChevronDown,
  ChevronRight,
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

        {/* Users - Admin Only */}
        {user?.role === "admin" && (
          <>
            <MenuItem
              to="/users"
              icon={<Users size={17} />}
              title="Users List"
              active={location.pathname === "/users"}
            />
          </>
        )}

        {/* Students */}
        <MenuItem
          to="/students"
          icon={<Users size={17} />}
          title="Student List"
          active={location.pathname === "/students"}
        />

        {/* Sessions */}
        <MenuItem
          to="/sessions"
          icon={<Calendar size={17} />}
          title="Sessions"
          active={location.pathname === "/sessions"}
        />

        {/* Classes */}
        <MenuItem
          to="/classes"
          icon={<School size={17} />}
          title="Classes"
          active={location.pathname === "/classes"}
        />

        {/* Subjects */}
        <MenuItem
          to="/subjects"
          icon={<BookOpen size={17} />}
          title="Subjects"
          active={location.pathname === "/subjects"}
        />

        {/* Section */}
        <MenuItem
          to="/section"
          icon={<ClipboardList size={17} />}
          title="Section"
          active={location.pathname === "/section"}
        />

        {/* Exams */}
        <MenuItem
          to="/exams"
          icon={<FileText size={17} />}
          title="Exams"
          active={location.pathname === "/exams"}
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
          icon={<PencilLine size={17} />}
          title="Results"
          active={location.pathname === "/results"}
        />

        {/* Class Results */}
        <MenuItem
          to="/class-results"
          icon={<PencilLine size={17} />}
          title="Class Results"
          active={location.pathname === "/class-results"}
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
