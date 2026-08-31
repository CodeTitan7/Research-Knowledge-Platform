import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Compounds from "./pages/Compounds";
import CompoundDetails from "./pages/CompoundDetails";
import CompoundForm from "./pages/CompoundForm";
import Documents from "./pages/Documents";
import DocumentDetails from "./pages/DocumentDetails";
import CompoundComparison from "./pages/CompoundComparison";
import DocumentUpload from "./pages/DocumentUpload";
import Research from "./pages/Research";
import QueryHistory from "./pages/QueryHistory";
import Users from "./pages/Users";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RoleProtectedRoute({ children, allowedRoles }) {
  const { userRole, loading } = useAuth();

  if (loading) return null;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Login & Register */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Application Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compounds" element={<Compounds />} />
        <Route
          path="/compounds/add"
          element={
            <RoleProtectedRoute allowedRoles={["Reviewer", "Administrator"]}>
              <CompoundForm />
            </RoleProtectedRoute>
          }
        />
        <Route path="/compounds/:id" element={<CompoundDetails />} />
        <Route
          path="/compounds/:id/edit"
          element={
            <RoleProtectedRoute allowedRoles={["Reviewer", "Administrator"]}>
              <CompoundForm />
            </RoleProtectedRoute>
          }
        />
        <Route
  path="/compounds/compare"
  element={<CompoundComparison />}
/>
        <Route path="/documents" element={<Documents />} />
        <Route
          path="/documents/upload"
          element={
            <RoleProtectedRoute allowedRoles={["Reviewer", "Administrator"]}>
              <DocumentUpload />
            </RoleProtectedRoute>
          }
        />
        <Route path="/documents/:id" element={<DocumentDetails />} />
        <Route path="/research" element={<Research />} />
        <Route path="/history" element={<QueryHistory />} />
        <Route
          path="/users"
          element={
            <RoleProtectedRoute allowedRoles={["Administrator"]}>
              <Users />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Fallback Unknown URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;