import React, { useState, useContext } from 'react';
import './ExploreMenu.css';
import { StoreContext } from '../../context/StoreContext';
import FoodDisplay from '../FoodDisplay/FoodDisplay';
import { menu_list } from '../../assets/assets.js'

const ExploreMenu = () => {
  const { foodList } = useContext(StoreContext);
  const [category, setCategory] = useState('All');

  const handleClick = (brandName) => {
    setCategory(brandName);
    scrollToTopBrands();
  };

  const scrollToTopBrands = () => {
    const topBrandsSection = document.getElementById('top-brands-section');
    if (topBrandsSection) {
      topBrandsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const uniqueCategories = ['All', ...new Set(foodList.map((item) => item.category))];

  return (
    <div>
      <div className='explore-menu' id='explore-menu'>
        <h1>Explore our Rice Products</h1>
        <p className='explore-menu-text'>Choose Rice Type</p>
         <div className="explore-menu-list">
              {menu_list.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.menu_name)}
              className="explore-menu-list-item">
              <img src={item.menu_image} alt="" />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>

        <hr />
        <FoodDisplay category={category} />
      </div>
    </div>
  );
};

export default ExploreMenu;
