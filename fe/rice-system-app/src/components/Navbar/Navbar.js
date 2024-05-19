import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("home");

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    if (menuItem === "menu") {
      navigate('/menu');
    } else if (menuItem === "home") {
      navigate('/');
    }
  };

  return (
    <div className="navbar">
      <Link to='/'>
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <li
          onClick={() => handleMenuClick("home")}
          className={menu === "home" ? "active" : ""}
        >
          HOME
        </li>
        <li
          onClick={() => handleMenuClick("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          MENU
        </li>
        <li
          onClick={() => handleMenuClick("app")}
          className={menu === "app" ? "active" : ""}
        >
          APP
        </li>
        <li
          onClick={() => handleMenuClick("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          CONTACT US
        </li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} width="45" height="50" alt="Search" />
        <div className="navbar-search-icon">
          <div className="dot"></div>
        </div>
        <Link to="/cart">
          <img src={assets.basket_icon} width="45" height="50" alt="Basket" />
        </Link>
        <button onClick={() => setShowLogin(true)}>SIGN IN</button>
      </div>
    </div>
  );
};

export default Navbar;
