import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import TaskList from "./TaskList";
import TrainingList from "./TrainingList";
import ContactPage from "./Contact";
import AuthModule from "./Auth/Auth";
import AuthRegister from "./Auth/AuthRegister";
import AuthLogin from "./Auth/AuthLogin";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./Auth/AuthRoute";
import { getCurrentUser, logoutUser } from "../services/AuthService";

function HomePage() {
  const currentUser = getCurrentUser();

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      window.location.href = "/auth";
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

export default function Component() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute children={<AuthModule />} />
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute children={<AuthRegister />} />
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute children={<AuthLogin />} />
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute children={<HomePage />} />
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute children={<TaskList />} />
            }
          />
          <Route
            path="/trainings"
            element={
              <ProtectedRoute children={<TrainingList />} />
            }
          />
          <Route
            path="/contacts/:id"
            element={
              <ProtectedRoute children={<ContactPage/>} />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}