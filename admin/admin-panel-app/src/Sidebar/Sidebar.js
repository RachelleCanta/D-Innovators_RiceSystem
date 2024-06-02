import React from 'react'
import './Sidebar.css'
import { assets } from '../assets/assets';

const Sidebar = () => {
  return (
    <div className='sidebar'>
    <div className="sidebar-options">
        <div className="sidebar-option">
            <img src={assets.add_icon} width="50px"alt=""/>
            <p>Add Products</p>
        </div>
        <div className="sidebar-option">
            <img src={assets.order_icon} width="50px" alt=""/>
            <p>List Products</p>
        </div>
        <div className="sidebar-option">
            <img src={assets.order_icon} width="50px"alt=""/>
            <p>Orders</p>
        </div>
    </div>
    </div>
  )
}

export default Sidebar;