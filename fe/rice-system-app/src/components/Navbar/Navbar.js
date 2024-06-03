import React, { useState, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    if (menuItem === "menu") {
      navigate("/menu");
    } else if (menuItem === "home") {
      navigate("/");
    } else if (menuItem === "app") {
      navigate("/app");
    } else if (menuItem === "contact-us") {
      navigate("/contact-us");
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
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
        <div className="navbar-cart-icon" onClick={handleCartClick}>
          <Link to="/cart">
            <img src={assets.basket_icon} width="45" height="50" alt="Basket" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>SIGN IN</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.bag_icon} alt="Bag" />
                <p>ORDERS</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>LOGOUT</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
