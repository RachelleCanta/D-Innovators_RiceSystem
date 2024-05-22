import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css';

const ContactUs = () => {
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

    const isOpen = isShopOpen ? `Open from Monday-Saturday, 9am to 11pm. Estimated delivery in 2-3 days.` : `Closed today. Next delivery in 2-3 days.`;
    setShopSchedule(isOpen);
  };

  const handleBackButtonClick = () => {
    navigate('/');
  };

  return (
    <div className="contact-us">
      <button className="back-button" onClick={handleBackButtonClick}>Back</button>
      <h2>SHOP SCHEDULE</h2>
      <p>{shopSchedule}</p>
      <p>Contact Number: 09776214212</p>
      <p>Email: zgm_riceshop@gmail.com</p>
      <h2>Current Date and Time (Philippine Time)</h2>
      <p>Date: {currentDate}</p>
      <p>Time: {currentTime}</p>
    </div>
  );
};

export default ContactUs;
