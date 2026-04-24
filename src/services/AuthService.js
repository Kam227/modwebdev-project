import Parse from "./parseClient";

export const createUser = async (newUser) => {
  const user = new Parse.User();
  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("email", newUser.email);
  user.set("password", newUser.password);
  user.set("role", "worker");

  try {
    const saved = await user.signUp();
    const acl = new Parse.ACL(saved);
    acl.setPublicReadAccess(true);
    saved.setACL(acl);
    await saved.save();
    return saved;
  } catch (error) {
    alert(`Error: ${error.message}`);
    return null;
  }
};

export const loginUser = async (user) => {
  try {
    const loggedIn = await Parse.User.logIn(user.email, user.password);
    // Upgrade ACL for accounts created before the public-read fix
    const acl = new Parse.ACL(loggedIn);
    acl.setPublicReadAccess(true);
    loggedIn.setACL(acl);
    await loggedIn.save();
    return loggedIn;
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
