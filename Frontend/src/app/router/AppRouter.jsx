import { Routes, Route } from "react-router-dom";

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

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />

      <Route path="/students" element={<StudentPage />} />

      <Route path="/students/add" element={<AddStudentPage />} />
      <Route path="/sessions" element={<SessionsPage />} />

      <Route path="/classes" element={<ClassesPage />} />

      <Route path="/subjects" element={<SubjectsPage />} />

      <Route path="/enrollments" element={<EnrollmentsPage />} />

      <Route path="/exams" element={<ExamsPage />} />

      <Route path="/marks" element={<MarksPage />} />

      <Route path="/results" element={<ResultsPage />} />

      <Route path="/reports" element={<h1>Reports</h1>} />

      <Route path="/history" element={<h1>Search & History</h1>} />

      <Route path="/backup" element={<h1>Backup & Restore</h1>} />

      <Route path="/settings" element={<h1>Settings</h1>} />
    </Routes>
  );
}

export default AppRouter;
