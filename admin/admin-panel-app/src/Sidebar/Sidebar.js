import React from 'react'
import './Sidebar.css'
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
    <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} width="20px"alt=""/>
            <p>Add Products</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} width="20px" alt=""/>
            <p>List Products</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} width="20px"alt=""/>
            <p>Orders</p>
        </NavLink>
    </div>
    </div>
  )
}

export default Sidebar;