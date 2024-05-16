import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';

const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className='app'>
      <Navbar/>
      <BrowserRouter basename='/'>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<PlaceOrder/>}/>
        </Routes>
        <Footer/>
        </BrowserRouter>
    </div>
  )
}

export default App
