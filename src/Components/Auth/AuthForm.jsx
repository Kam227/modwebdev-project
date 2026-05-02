const AuthForm = ({ user, onChange, onSubmit, isRegister }) => {
  return (
    <form onSubmit={onSubmit}>
      {isRegister && (
        <>
          <div className="auth-form-group">
            <label>First Name</label>
            <input
              type="text"
              value={user.firstName}
              onChange={onChange}
              name="firstName"
              placeholder="First name"
              required
            />
          </div>

          <div className="auth-form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={user.lastName}
              onChange={onChange}
              name="lastName"
              placeholder="Last name"
              required
            />
          </div>
        </>
      )}

      <div className="auth-form-group">
        <label>Email</label>
        <input
          type="email"
          value={user.email}
          onChange={onChange}
          name="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="auth-form-group">
        <label>Password</label>
        <input
          type="password"
          value={user.password}
          onChange={onChange}
          name="password"
          placeholder="Password"
          required
        />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button type="submit" className="btn-primary">
          {isRegister ? "Create account" : "Sign in"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
