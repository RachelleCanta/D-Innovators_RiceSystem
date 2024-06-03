import React, { useState, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("LOG IN");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "LOG IN") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
       
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        alert("No response from server. Please try again later.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-inputs">
          {currState === "LOG IN" ? null : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Enter Your Name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Enter Your Email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type={showPassword ? "text" : "password"} 
            placeholder='Enter Your Password' required />
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
          <button type='submit'>{currState === "SIGN UP" ? "CREATE ACCOUNT" : "LOG IN"}</button>
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

export default LoginPopup;
