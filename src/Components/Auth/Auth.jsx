import { Link } from "react-router-dom";

const AuthModule = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-brand">HomeLink</h1>
        <p className="auth-subtitle">Connect with your community</p>

        <hr className="auth-divider" />

        <div className="auth-actions">
          <Link to="/register">
            <button className="btn-primary">Create an account</button>
          </Link>

          <Link to="/login">
            <button className="btn-secondary">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthModule;
