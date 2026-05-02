import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "./AuthForm";
import { createUser } from "../../services/AuthService";

const AuthRegister = () => {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const userCreated = await createUser(newUser);
    if (userCreated) {
      alert(`${userCreated.get("firstName")}, you successfully registered!`);
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-brand">HomeLink</h1>
        <p className="auth-subtitle">Create your account</p>

        <hr className="auth-divider" />

        <AuthForm
          user={newUser}
          onChange={onChangeHandler}
          onSubmit={onSubmitHandler}
          isRegister={true}
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

export default AuthRegister;
