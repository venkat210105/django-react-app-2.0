import React, { useState } from "react";
//import "../styles/LoginModal.css";

const ForgotPasswordModal = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [message, setMessage] = useState(""); // Add message state for feedback

  if (!show) return null;

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    setIsLoading(true); // Start loading
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Show success message
        alert(data.message); // Optional: Show alert for success
        onClose(); // Close the modal
      } else {
        setMessage(data.message || "An error occurred. Please try again."); // Show error message
        alert(data.message || "An error occurred. Please try again."); // Optional: Show alert for error
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setMessage("An error occurred while processing your request."); // Show generic error message
      alert("An error occurred while processing your request."); // Optional: Show alert for error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to reset your password</p>
        </div>
        <div className="modal-body">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading} // Disable input while loading
          />
          {message && <p className="message">{message}</p>} {/* Display message */}
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Sending..." : "Submit"} {/* Show loading text */}
          </button>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;