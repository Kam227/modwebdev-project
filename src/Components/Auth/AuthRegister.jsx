import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    setNewUser({
      ...newUser,
      [name]: value,
    });
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
    <div>
      <h2>Register</h2>
      <AuthForm
        user={newUser}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        isRegister={true}
      />
    </div>
  );
};

export default AuthRegister;