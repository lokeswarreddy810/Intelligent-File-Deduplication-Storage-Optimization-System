import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AuditLogsPage from "../pages/audit/AuditLogsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import DeletionHistoryPage from "../pages/deletion/DeletionHistoryPage";
import DuplicateDetailsPage from "../pages/duplicates/DuplicateDetailsPage";
import DuplicatesPage from "../pages/duplicates/DuplicatesPage";
import FileDetailsPage from "../pages/files/FileDetailsPage";
import FilesPage from "../pages/files/FilesPage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/files"
            element={<FilesPage />}
          />

          <Route
            path="/files/:fileId"
            element={<FileDetailsPage />}
          />

          <Route
            path="/duplicates"
            element={<DuplicatesPage />}
          />

          <Route
            path="/duplicates/:groupId"
            element={<DuplicateDetailsPage />}
          />

          <Route
            path="/deletion-history"
            element={<DeletionHistoryPage />}
          />

          <Route
            path="/audit-logs"
            element={<AuditLogsPage />}
          />

          <Route
            path="/unauthorized"
            element={<UnauthorizedPage />}
          />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default AppRoutes;