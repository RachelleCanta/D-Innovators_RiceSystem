import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <img src={assets.header_img} alt="" />
        {/* <h2>Order your favorite rice aroma here</h2>
        <p>Savor the flavor of quality rice with just a click. Order your favorite rice product hassle-free!</p> */}
        <Link to="/menu">
          <button>View Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
