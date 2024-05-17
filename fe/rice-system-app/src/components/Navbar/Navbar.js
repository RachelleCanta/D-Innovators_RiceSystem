import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  return (
    <div className="navbar">
      <Link to='/'>
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <li
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          HOME
        </li>
        <li
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          MENU
        </li>
        <li
          onClick={() => setMenu("app")}
          className={menu === "app" ? "active" : ""}
        >
          APP
        </li>
        <li
          onClick={() => setMenu("contact-us")}
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
