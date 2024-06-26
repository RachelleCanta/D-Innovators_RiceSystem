import React, { useContext } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodDisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext);
  const filteredFood = category === 'All' ? foodList : foodList.filter((food) => food.category === category);

  // * test
  // const notifyAdd = (message, name) => toast.success(`${name} ${message}`);
  // const notifyRemove = (message, name) => toast.error(`${name} ${message}`);

  return (
    <div className='food-display' id='food-display'>
      <h2>RICE BRANDS</h2>
      {filteredFood.map((item) => (
        <FoodItem
          key={item._id}
          id={item._id}
          name={item.name}
          description={item.description}
          price={item.price}
          image={item.image}
          stocks={item.stocks}
          // * test
          // notifyAdd={notifyAdd}
          // notifyRemove={notifyRemove}
        />
      ))}
    </div>
  );
};

export default FoodDisplay;
