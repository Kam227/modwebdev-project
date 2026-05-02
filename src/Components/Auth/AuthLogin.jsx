import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "./AuthForm";
import { loginUser } from "../../services/AuthService";

const AuthLogin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const loggedInUser = await loginUser(user);
    if (loggedInUser) {
      alert(`Welcome back, ${loggedInUser.get("firstName")}!`);
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-brand">HomeLink</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <hr className="auth-divider" />

        <AuthForm
          user={user}
          onChange={onChangeHandler}
          onSubmit={onSubmitHandler}
          isRegister={false}
        />

        <div style={{ textAlign: "center" }}>
          <Link to="/auth">
            <button className="auth-back-link">Back to home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
