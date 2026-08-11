import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Compounds from "./pages/Compounds";
import CompoundDetails from "./pages/CompoundDetails";
import CompoundForm from "./pages/CompoundForm";
import Documents from "./pages/Documents";
import DocumentDetails from "./pages/DocumentDetails";
import DocumentUpload from "./pages/DocumentUpload";
import Research from "./pages/Research";


function QueryHistory() {
  return (
    <h1>Query History</h1>
  );
}

function Users() {
  return (
    <h1>Users</h1>
  );
}

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* Application */}
      <Route
        element={<DashboardLayout />}
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/compounds"
          element={<Compounds />}
        />
        <Route
  path="/compounds/:id"
  element={<CompoundDetails />}
/>
        <Route
  path="/compounds/add"
  element={<CompoundForm />}
/>

<Route
  path="/compounds/:id/edit"
  element={<CompoundForm />}
/>

        <Route
          path="/documents"
          element={<Documents />}
        />
<Route
  path="/research"
  element={<Research />}
/>

        <Route
          path="/history"
          element={<QueryHistory />}
        />

        <Route
  path="/documents/upload"
  element={<DocumentUpload />}
/>
      <Route
  path="/documents/:id"
  element={<DocumentDetails />}
/>
        <Route
          path="/users"
          element={<Users />}
        />
      </Route>

      {/* Unknown URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;