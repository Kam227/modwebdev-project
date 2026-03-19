import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/AuthService";

const ProtectedRoute = ({ children }) => {
  const currentUser = getCurrentUser();

  return currentUser ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;