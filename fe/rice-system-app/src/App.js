import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Menu from './components/Menu/Menu';
import StoreProvider from './context/StoreContext';
import TrackOrder from './pages/TrackOrder/TrackOrder';
import ContactUs from './components/ContactUs/ContactUs';
import AppDownload from './components/AppDownload/AppDownload';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleCloseCart = () => {
    console.log("Cart closed");
  };

  return (
    <StoreProvider>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <div className='app'>
        <BrowserRouter basename='/'>
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart onClose={handleCloseCart} />} />
            <Route path='/checkout' element={<PlaceOrder />} />
            <Route path='/track-order' element={<TrackOrder />} />
            <Route path='/menu' element={<Menu />} />
            <Route path='/contact-us' element={<ContactUs />} />
            <Route path='/app' element={<AppDownload />} />
            <Route path='/contact-us' element={<ContactUs />}/>

          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </StoreProvider>
  );
};

export default App;
