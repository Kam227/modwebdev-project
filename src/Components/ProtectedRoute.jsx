import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/AuthService";

// This component protects routes that require authentication
// If no user is logged in, it redirects to the auth page
const ProtectedRoute = ({ children }) => {
  const currentUser = getCurrentUser();

  return currentUser ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;