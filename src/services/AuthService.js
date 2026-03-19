import Parse from "parse";

export const createUser = async (newUser) => {
  const user = new Parse.User();

  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("email", newUser.email);
  user.set("password", newUser.password);

  try {
    const newUserSaved = await user.signUp();
    return newUserSaved;
  } catch (error) {
    alert(`Error: ${error.message}`);
    return null;
  }
};

export const loginUser = async (user) => {
  try {
    const loggedInUser = await Parse.User.logIn(user.email, user.password);
    return loggedInUser;
  } catch (error) {
    alert(`Error: ${error.message}`);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await Parse.User.logOut();
    return true;
  } catch (error) {
    alert(`Error: ${error.message}`);
    return false;
  }
};

export const getCurrentUser = () => {
  return Parse.User.current();
};