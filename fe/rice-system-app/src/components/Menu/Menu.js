import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { menu_list } from "../../assets/assets";
import './Menu.css';
import FoodDisplay from '../FoodDisplay/FoodDisplay';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [shopSchedule, setShopSchedule] = useState('');
  const [isShopOpen, setIsShopOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      setCurrentTime(now.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila' }));
      setCurrentDate(now.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' }));

      setIsShopOpen(hours >= 9 && hours < 23);

      updateShopSchedule();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateShopSchedule = () => {
    const now = new Date();
    const day = now.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = daysOfWeek[day];

    const isOpen = isShopOpen ? `Open from Monday-Saturday, 9am to 6pm. Estimated Delivery in 1-3 days.` : `Closed today. Next delivery in 2-3 days.`;
    setShopSchedule(isOpen);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackButtonClick = () => {
    navigate('/');
  };

  const handleAddToCart = (item) => {
    toast.success(`${item.menu_name} added to cart.`);
  };

  const handleRemoveFromCart = (item) => {
    toast.error(`${item.menu_name} removed from cart.`);
  };

  return (
    <div className="menu-page">
      <div className="info-section">
        <div className="schedule">
          <h2>SHOP SCHEDULE</h2>
          <p>{shopSchedule}</p>
          {!isShopOpen && <p>SHOP IS ALREADY CLOSED</p>}
        </div>
        <div className="clock">
          <h3>Current Date and Time (Philippine Time)</h3>
          <p>Date: {currentDate}</p>
          <p>Time: {currentTime}</p>
        </div>
        <button className="back-button" onClick={handleBackButtonClick}>Back</button>
      </div>
      <div className="main-section">
        <div className="dashboard">
          <h2>Available Rice Product</h2>
          <ul>
            {menu_list.map((item) => (
              <li key={item.menu_name} onClick={() => handleCategoryClick(item.menu_name)}>
                <img src={item.menu_image} alt={item.menu_name} />
                <span>{item.menu_name}</span>
                <span className="top-brand"></span>
                {/* <button onClick={() => handleAddToCart(item)}>Add</button>
                <button onClick={() => handleRemoveFromCart(item)}>Remove</button> */}
              </li>
            ))}
          </ul>
        </div>
        <div className="menu-display">
          {selectedCategory && <FoodDisplay category={selectedCategory} />}
        </div>
      </div>
    </div>
  );
};

export default Menu;
