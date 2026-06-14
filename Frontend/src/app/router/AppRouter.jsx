import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import ProtectedLayout from "./ProtectedLayout";

import DashboardPage from "../../pages/dashboard/DashboardPage";
import StudentPage from "../../pages/students/StudentPage";
import AddStudentPage from "../../pages/students/AddStudentPage";
import SessionsPage from "../../pages/sessions/SessionsPage";
import ClassesPage from "../../pages/classes/ClassesPage";
import SubjectsPage from "../../pages/subjects/SubjectsPage";
import EnrollmentsPage from "../../pages/enrollments/EnrollmentsPage";
import ExamsPage from "../../pages/exams/ExamsPage";
import MarksPage from "../../pages/marks/MarksPage";
import ResultsPage from "../../pages/results/ResultsPage";
import LoginPage from "../../pages/auth/LoginPage";

import UsersPage from "../../pages/users/GetUsers";
import AddUserPage from "../../pages/users/CreateUser";
function AppRouter() {
  return (
    <Routes>
      {/* LOGIN PAGE ONLY */}
      <Route path="/login" element={<LoginPage />} />

      {/* DASHBOARD PAGES */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <UsersPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/add"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AddUserPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <StudentPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/students/add"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AddStudentPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SessionsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ClassesPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SubjectsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/enrollments"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <EnrollmentsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ExamsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/marks"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <MarksPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ResultsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;
