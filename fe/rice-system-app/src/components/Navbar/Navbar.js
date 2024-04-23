import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
    const [menu, setMenu] = useState("menu");
    
    return (
      <div className="navbar">
        <img src={assets.logo} alt="Logo" className="logo"/>
        <ul className="navbar-menu">
            <li onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>HOME</li>
            <li onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>MENU</li>
            <li onClick={() => setMenu("app")} className={menu === "app" ? "active" : ""}>APP</li>
            <li onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>CONTACT US</li>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} width="45" height="50" alt="Search"/>
            <div className="navbar-search-icon">
                <div className="dot" ></div>
            </div>
            <img src={assets.basket_icon} width="45" height="50" alt="Basket"/>
            <button>SIGN IN</button>
        </div>
      </div>
    );
}

export default Navbar;
