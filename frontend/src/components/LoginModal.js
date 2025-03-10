import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginModal.css";

const API_URL = "https://django-react-app-2-0.onrender.com";

const LoginModal = ({ show, onClose, switchToSignup, switchToForgotPassword }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Invalid username or password.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store the token
      alert("Login Successful!");
      onClose();
      navigate("/main"); // Redirect to the main page
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message || "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Welcome Back!</h2>
          <p>Login to continue to Plant Disease Detection</p>
        </div>
        <div className="modal-body">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          {error && <p className="error-message">{error}</p>}
          <button className="login-button" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            Close
          </button>
        </div>
        <div className="modal-footer">
          <p>
            Don't have an account?{" "}
            <span className="signup-link" onClick={switchToSignup}>
              Sign Up
            </span>
          </p>
          <p>
            <span className="forgot-password-link" onClick={switchToForgotPassword}>
              Forgot Password?
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;