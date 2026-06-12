import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import "./AuthPages.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { login, isLoading, error: storeError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      setSuccess(true);
      setTimeout(() => {
          navigate("/encounters");
      }, 500);
    } catch (err) {
      // Error is already set in store
    }
  };

  const displayError = localError || storeError;

  return (
    <div className="auth-page">
      <h1 className="auth-page-title">Login</h1>

      {displayError && (
        <div className="auth-alert auth-alert-error">
          {displayError}
        </div>
      )}

      {success && (
        <div className="auth-alert auth-alert-success">
          Login successful! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-field-group">
          <label htmlFor="email" className="auth-label">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            disabled={isLoading}
          />
        </div>

        <div className="auth-field-group">
          <label htmlFor="password" className="auth-label">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-submit auth-submit-login"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-footnote">
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">
          Register
        </Link>
      </p>
    </div>
  );
}
