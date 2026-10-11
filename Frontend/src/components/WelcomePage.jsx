import React, { useState } from 'react';

export default function WelcomePage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLoginSuccess(username);
    }
  };

  const handleSocialLogin = (provider) => {
    onLoginSuccess(`${provider}_User`);
  };

  return (
    <section id="welcome-page" className="page-section welcome-hero">
      <div className="welcome-left">
        <div className="brand-title">
          <h1>CONCERT<br /><span>TICKETS</span> BOOKING</h1>
          <div className="sub-line">Music connects us</div>
        </div>
        <div className="features-row">
          <div className="feature-item">
            <i className="fa-solid fa-ticket"></i>
            <p>Book Tickets<br />Easily</p>
          </div>
          <div className="feature-item">
            <i className="fa-regular fa-calendar-days"></i>
            <p>View Event<br />Information</p>
          </div>
          <div className="feature-item">
            <i className="fa-regular fa-star"></i>
            <p>Enjoy the Show<br />Together</p>
          </div>
        </div>
      </div>

      <div className="welcome-right">
        <div className="login-card">
          <h2 className="welcome-heading">Welcome</h2>
          <h3>Log in to your account</h3>
          <p className="login-subtext">Book your favorite concert tickets and don't miss the moment.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <i className="fa-regular fa-user"></i>
              <input
                type="text"
                placeholder="Email or Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-box">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-pwd`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="form-options">
              <label><input type="checkbox" /> Remember me</label>
              <a href="#forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>

            <button type="submit" className="submit-login-btn">Log In</button>
          </form>

          <div className="divider"><span>or continue with</span></div>

          <div className="social-login-row">
            <button className="social-btn" onClick={() => handleSocialLogin('Google')}><i className="fa-brands fa-google"></i></button>
            <button className="social-btn" onClick={() => handleSocialLogin('Apple')}><i className="fa-brands fa-apple"></i></button>
            <button className="social-btn" onClick={() => handleSocialLogin('Facebook')}><i className="fa-brands fa-facebook-f"></i></button>
          </div>

          <p className="signup-text">Don't have an account? <a href="#signup" onClick={(e) => e.preventDefault()}>Sign Up</a></p>
        </div>
      </div>
    </section>
  );
}