import React, { useState } from "react";
import "../styles/SignupModal.css";

const SignupModal = ({ show, onClose, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Success message from backend
        onClose(); // Close the modal on successful signup
      } else {
        setError(data.error || "An error occurred during signup."); // Error message from backend
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create an Account</h2>
          <p>Join us to protect your crops and ensure a healthy harvest.</p>
        </div>
        <div className="modal-body">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          {error && <p className="error-message">{error}</p>}
          <button className="signup-button" onClick={handleSignup} disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            Close
          </button>
        </div>
        <div className="modal-footer">
          <p>
            Already have an account?{" "}
            <span className="login-link" onClick={switchToLogin}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;