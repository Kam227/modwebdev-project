import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/AuthService";

// This component prevents authenticated users from accessing auth pages
// (e.g., login/register) and redirects them to the main app instead
const AuthRoute = ({ children }) => {
  const currentUser = getCurrentUser();

  return currentUser ? <Navigate to="/" replace /> : children;
};

export default AuthRoute;