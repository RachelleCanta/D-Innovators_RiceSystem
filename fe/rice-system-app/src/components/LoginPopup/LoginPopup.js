import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("LOG IN");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='login-popup'>
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-inputs">
          {currState === "LOG IN" ? null : <input type="text" placeholder='Enter Your Username:' required />}
          <input type="email" placeholder='Enter Your Email:' required />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder='Enter Your Password:' 
            required 
          />
        </div>
        <div className="show-password-container">
          <input 
            type="checkbox" 
            id="show-password" 
            checked={showPassword} 
            onChange={() => setShowPassword(!showPassword)} 
          />
          <label htmlFor="show-password">Show Password</label>
        </div>
        <div className="login-popup-button-wrapper">
          <button>{currState === "SIGN UP" ? "CREATE ACCOUNT" : "LOG IN"}</button>
        </div>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "LOG IN"
          ? <p>Create a new account? <span onClick={() => setCurrState("SIGN UP")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("LOG IN")}>Login here</span></p>
        }
      </form>
    </div>
  );
}

export default LoginPopup
