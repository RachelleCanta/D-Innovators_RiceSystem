import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';

const AppDownload = () => {
  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div className='app-download' id='app-download'>
      <button className="back-button" onClick={handleBackButtonClick}>Back</button>
      <p>For Better Experience Download <br/>ZGM Rich Shop</p>
      <div className="app-download-platforms">
          <img src={assets.play_store} alt=""/>
          <img src={assets.app_store} alt=""/>
      </div>      
    </div>
  );
};

export default AppDownload;
