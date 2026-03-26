import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { createUser } from "../../services/AuthService";

// Handles user registration logic
const AuthRegister = () => {
  const navigate = useNavigate(); // used to redirect after successful register

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Updates state when user types into form
  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Handles form submission
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