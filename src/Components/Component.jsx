import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import TaskList from "./TaskList";
import TrainingList from "./TrainingList";
import ContactPage from "./Contact";
import AuthModule from "./Auth/Auth";
import AuthRegister from "./Auth/AuthRegister";
import AuthLogin from "./Auth/AuthLogin";
import { getCurrentUser, logoutUser } from "../services/AuthService";
import ProtectedRoute from "./ProtectedRoute";

function HomePage() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logoutUser();

    if (success) {
      navigate("/auth");
    }
  };

  return (
    <div>
      <h1>Volunteer App</h1>

      <p>Welcome, {currentUser.get("firstName")}!</p>
      <p>Select a page:</p>

      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/tasks">Tasks</Link>
        <Link to="/trainings">Trainings</Link>
      </nav>

      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

/**
 * Main component that sets up routing for the volunteer app.
 * It defines routes for authentication and protected app pages.
 */
export default function Component() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/auth" element={<AuthModule />} />
          <Route path="/register" element={<AuthRegister />} />
          <Route path="/login" element={<AuthLogin />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainings"
            element={
              <ProtectedRoute>
                <TrainingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts/:id"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}