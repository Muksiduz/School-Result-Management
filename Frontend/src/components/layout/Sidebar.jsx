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

  const activeClass = "bg-blue-50 text-blue-600 font-medium";

  const normalClass = "text-gray-700 hover:bg-gray-100";

  return (
    <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {/* Dashboard */}

        <MenuItem
          to="/"
          icon={<LayoutDashboard size={18} />}
          title="Dashboard"
          active={location.pathname === "/"}
        />
        {/* Users - Admin Only */}

        {user?.role === "admin" && (
          <>
            <DropdownButton
              title="Users"
              icon={<Users size={18} />}
              open={userOpen}
              onClick={() => setUserOpen(!userOpen)}
            />

            {userOpen && (
              <div className="ml-10 space-y-1">
                <SubMenuItem
                  to="/users"
                  title="Users List"
                  active={location.pathname === "/users"}
                />

                <SubMenuItem
                  to="/users/add"
                  title="Add User"
                  active={location.pathname === "/users/add"}
                />
              </div>
            )}
          </>
        )}

        {/* Students */}

        <DropdownButton
          title="Students"
          icon={<Users size={18} />}
          open={studentOpen}
          onClick={() => setStudentOpen(!studentOpen)}
        />

        {studentOpen && (
          <div className="ml-10 space-y-1">
            <SubMenuItem
              to="/students"
              title="Student List"
              active={location.pathname === "/students"}
            />

            <SubMenuItem
              to="/students/add"
              title="Add Student"
              active={location.pathname === "/students/add"}
            />
          </div>
        )}

        {/* Sessions */}

        <MenuItem
          to="/sessions"
          icon={<Calendar size={18} />}
          title="Sessions"
          active={location.pathname === "/sessions"}
        />

        {/* Classes */}

        <MenuItem
          to="/classes"
          icon={<School size={18} />}
          title="Classes"
          active={location.pathname === "/classes"}
        />

        {/* Subjects */}

        <MenuItem
          to="/subjects"
          icon={<BookOpen size={18} />}
          title="Subjects"
          active={location.pathname === "/subjects"}
        />

        {/* Enrollments */}

        <MenuItem
          to="/section"
          icon={<ClipboardList size={18} />}
          title="section"
          active={location.pathname === "/section"}
        />

        {/* Exams */}

        <MenuItem
          to="/exams"
          icon={<FileText size={18} />}
          title="Exams"
          active={location.pathname === "/exams"}
        />

        {/* Marks */}

        <MenuItem
          to="/marks"
          icon={<PencilLine size={18} />}
          title="Marks Entry"
          active={location.pathname === "/marks"}
        />

        {/* Results */}

        <MenuItem
          to="/results"
          icon={<PencilLine size={18} />}
          title=" Results"
          active={location.pathname === "/results"}
        />

        {/* class Result */}

        <MenuItem
          to="/class-results"
          icon={<PencilLine size={18} />}
          title="Class Results"
          active={location.pathname === "/class-results"}
        />

        {/* Search */}

        <MenuItem
          to="/history"
          icon={<Search size={18} />}
          title="Search & History"
          active={location.pathname === "/history"}
        />

        {/* Backup */}

        <MenuItem
          to="/backup"
          icon={<DatabaseBackup size={18} />}
          title="Backup & Restore"
          active={location.pathname === "/backup"}
        />

        {/* Settings */}

        <MenuItem
          to="/settings"
          icon={<Settings size={18} />}
          title="Settings"
          active={location.pathname === "/settings"}
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
      className={`
        flex
        items-center
        gap-3
        p-3
        rounded-xl
        transition
        ${
          active
            ? "bg-blue-50 text-blue-600 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}>
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
      className="
        flex
        items-center
        justify-between
        w-full
        p-3
        rounded-xl
        text-gray-700
        hover:bg-gray-100
      ">
      <div className="flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </div>

      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
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
      className={`
        block
        px-3
        py-2
        rounded-lg
        text-sm
        transition
        ${
          active
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:bg-gray-100"
        }
      `}>
      {title}
    </Link>
  );
}

export default Sidebar;
