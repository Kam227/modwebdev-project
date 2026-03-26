import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/AuthService";

const AuthRoute = ({ children }) => {
  const currentUser = getCurrentUser();

  return currentUser ? <Navigate to="/" replace /> : children;
};

export default AuthRoute;