import React, { useState } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "../styles/Home.css";

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const switchToForgotPassword = () => {
    setShowLogin(false);
    setShowForgotPassword(true);
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-links">
          <button className="nav-btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button className="nav-btn" onClick={() => setShowSignup(true)}>
            Sign Up
          </button>
          <button className="nav-btn">About</button>
          <button className="nav-btn">Contact Us</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Protect Your Plants with Advanced Disease Detection</h1>
        <p className="subtitle">
          Identify and manage plant diseases with cutting-edge technology. Ensure healthy crops and maximize yields with our AI-powered solutions.
        </p>
        <div className="hero-buttons">
          <button className="hero-btn">Get Started</button>
          <button className="hero-btn">Learn More</button>
        </div>
      </div>

      {/* Disease Detection Tips Section */}
      <div className="tips-section">
        <h2>Disease Detection Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <img src="https://thumbs.dreamstime.com/z/concept-dead-living-tree-white-background-69507965.jpg" alt="Disease 1" />
            <h3>Early Signs of Plant Diseases</h3>
            <p>Learn how to identify early symptoms of common plant diseases to take timely action.</p>
          </div>
          <div className="tip-card">
            <img src="https://tg-cdn.azureedge.net/sites/default/files/images/paragraph/italrb/Blog-356-Guide-to-Summer-Lawn-Care.jpg" alt="Disease 2" />
            <h3>Preventive Measures</h3>
            <p>Discover best practices to prevent plant diseases and maintain healthy crops.</p>
          </div>
          <div className="tip-card">
            <img src="https://thumbs.dreamstime.com/b/treatment-garden-flowers-pests-diseases-treatment-garden-flowers-pests-diseases-studio-photo-118535559.jpg" alt="Disease 3" />
            <h3>Treatment Solutions</h3>
            <p>Explore effective treatment options for various plant diseases.</p>
          </div>
        </div>
      </div>

      {/* Case Studies Section */}
      <div className="case-studies-section">
        <h2>Case Studies</h2>
        <div className="case-studies-grid">
          <div className="case-study-card">
            <img src="https://th.bing.com/th/id/R.81e4e862bb3df7799070844fe45e51e9?rik=02C8M7ixDCKAUQ&riu=http%3a%2f%2fthefarmatgreenvillage.com%2fwp-content%2fuploads%2f2018%2f05%2fheirloom-tomatoes.jpg&ehk=SGak%2fwbVDKqHBHUoAIln%2bvIipcboqNQNX%2bRxGeoq9SE%3d&risl=&pid=ImgRaw&r=0" alt="Case Study 1" />
            <h3>Tomato Blight Detection</h3>
            <p>How our AI system helped farmers detect and manage tomato blight effectively.</p>
            <button className="case-study-btn">Read More</button>
          </div>
          <div className="case-study-card">
            <img src="https://source.roboflow.com/qjJyUvbsX4pek3bL7ZfB/7ReeWfuxY8WRlaZN0usa/original.jpg" alt="Case Study 2" />
            <h3>Wheat Rust Prevention</h3>
            <p>A success story of preventing wheat rust using our disease detection tools.</p>
            <button className="case-study-btn">Read More</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2023 Plant Disease Detection. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        switchToSignup={switchToSignup}
        switchToForgotPassword={switchToForgotPassword}
      />
      <SignupModal
        show={showSignup}
        onClose={() => setShowSignup(false)}
        switchToLogin={switchToLogin}
      />
      <ForgotPasswordModal
        show={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}

export default Home;