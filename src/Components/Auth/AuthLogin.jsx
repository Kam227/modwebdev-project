import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    setUser({
      ...user,
      [name]: value,
    });
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
    <div>
      <h2>Login</h2>
      <AuthForm
        user={user}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        isRegister={false}
      />
    </div>
  );
};

export default AuthLogin;