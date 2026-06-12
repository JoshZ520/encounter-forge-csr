import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import "./AuthPages.css";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { register, isLoading, error: storeError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (!email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await register(email, password);
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
      <h1 className="auth-page-title">Register</h1>

      {displayError && (
        <div className="auth-alert auth-alert-error">
          {displayError}
        </div>
      )}

      {success && (
        <div className="auth-alert auth-alert-success">
          Registration successful! Redirecting...
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
            Password (min 8 characters):
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

        <div className="auth-field-group">
          <label htmlFor="confirmPassword" className="auth-label">
            Confirm Password:
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-submit auth-submit-register"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="auth-footnote">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Login
        </Link>
      </p>
    </div>
  );
}
