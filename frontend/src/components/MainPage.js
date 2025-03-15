import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";

const API_URL = "https://django-react-app-2-0.onrender.com";
//const API_URL = "http://127.0.0.1:8000";

const MainPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [username, setUsername] = useState("");
  const [showEditMobile, setShowEditMobile] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch logged-in user's details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
    
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
    
        const responseText = await response.text(); // Inspect response text
        console.log("Response Text:", responseText);
    
        if (response.ok) {
          const userData = JSON.parse(responseText); // Handle JSON parsing separately
          console.log("User Data:", userData);
          setUsername(userData.username);
        } else {
          console.error("Failed to fetch user data:", response.status, response.statusText);
          setError("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred while fetching user data.");
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPredictionResult("");
    } else {
      setError("Please upload a valid image file (JPEG, PNG).");
    }
  };

  // Handle file upload and prediction
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setPredictionResult(data.prediction);
      } else {
        setError(data.message || "An error occurred during prediction.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setError("An error occurred during upload.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Handle updates (password, email, mobile)
  const handleUpdate = async (endpoint, body, successMessage) => {
    setUpdateLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        setError(successMessage);
        return true; // Indicate success
      } else {
        setError(data.message || `Failed to update ${endpoint.split("-")[1]}`);
        return false; // Indicate failure
      }
    } catch (error) {
      console.error(`Error updating ${endpoint.split("-")[1]}:`, error);
      setError(`An error occurred while updating the ${endpoint.split("-")[1]}.`);
      return false; // Indicate failure
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    const success = await handleUpdate(
      "update-password",
      { currentPassword, newPassword },
      "Password updated successfully!"
    );
    if (success) setShowEditPassword(false);
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const success = await handleUpdate(
      "update-email",
      { newEmail },
      "Email updated successfully!"
    );
    if (success) setShowEditEmail(false);
  };

  const handleUpdateMobile = async () => {
    if (!newMobile || !/^\d{10}$/.test(newMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const success = await handleUpdate(
      "update-mobile",
      { newMobile },
      "Mobile number updated successfully!"
    );
    if (success) setShowEditMobile(false);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setShowSidebar(false);
        setShowEditMobile(false);
        setShowEditEmail(false);
        setShowEditPassword(false);
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <div className="main-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-links">
          <button className="nav-btn" onClick={handleUpload} disabled={isLoading}>
            {isLoading ? "Predicting..." : "Upload"}
          </button>
          <button className="nav-btn" onClick={() => setShowSidebar(true)}>
            Settings
          </button>
          <button className="nav-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Settings Sidebar */}
      {showSidebar && (
        <div className="sidebar-overlay active" onClick={() => setShowSidebar(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowSidebar(false)}>
              &#10005;
            </button>
            <div className="sidebar-content">
              <h3>{username}</h3>
              <p className="edit-info" onClick={() => setShowEditMobile(true)}>
                Edit Mobile No.
              </p>
              <p className="edit-info" onClick={() => setShowEditEmail(true)}>
                Edit Email
              </p>
              <p className="edit-info" onClick={() => setShowEditPassword(true)}>
                Edit Password
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mobile No. Modal */}
      {showEditMobile && (
        <div className="modal-overlay" onClick={() => setShowEditMobile(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Mobile No.</h2>
            <input
              type="text"
              placeholder="New Mobile No."
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateMobile()}
              aria-label="New Mobile Number"
            />
            <button onClick={handleUpdateMobile} disabled={updateLoading}>
              {updateLoading ? "Updating..." : "Update Mobile No."}
            </button>
            <button onClick={() => setShowEditMobile(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Email Modal */}
      {showEditEmail && (
        <div className="modal-overlay" onClick={() => setShowEditEmail(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Email</h2>
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              aria-label="New Email"
            />
            <button onClick={handleUpdateEmail} disabled={updateLoading}>
              {updateLoading ? "Updating..." : "Update Email"}
            </button>
            <button onClick={() => setShowEditEmail(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Password Modal */}
      {showEditPassword && (
        <div className="modal-overlay" onClick={() => setShowEditPassword(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              aria-label="Current Password"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-label="New Password"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm New Password"
            />
            <button onClick={handleUpdatePassword} disabled={updateLoading}>
              {updateLoading ? "Updating..." : "Update Password"}
            </button>
            <button onClick={() => setShowEditPassword(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <h1>Plant Disease Detection</h1>
        <p className="subtitle">
          Upload an image of your plant to detect diseases and get recommendations.
        </p>

        {/* File Upload Section */}
        <div className="upload-section">
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="file-upload" className="upload-btn">
            Choose Image
          </label>
          {selectedFile && (
            <div className="file-info">
              <p>Selected File: {selectedFile.name}</p>
              <button className="predict-btn" onClick={handleUpload} disabled={isLoading}>
                {isLoading ? "Predicting..." : "Predict Disease"}
              </button>
            </div>
          )}
        </div>

        {/* Prediction Result Section */}
        {predictionResult && (
          <div className="prediction-result">
            <h2>Prediction Result</h2>
            <p>{predictionResult}</p>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default MainPage;