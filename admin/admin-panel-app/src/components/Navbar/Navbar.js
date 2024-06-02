import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
const Navbar = () => {
  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} width='100px' height='80px'alt=""/>
      <img className='profile' src={assets.profile_image} width='50px' height='60px'alt=""/>
    </div>
  )
}

export default Navbar
