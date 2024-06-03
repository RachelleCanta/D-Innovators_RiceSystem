import React from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { food_list } from "../../assets/assets";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodDisplay = ({ category }) => {
  const filteredFood = category === "All"
    ? food_list
    : food_list.filter((food) => food.category === category);

  const notifyAdd = (name) => toast.success(`${name} added to cart`);
  const notifyRemove = (name) => toast.error(`${name} removed from cart`);

  return (
    <div className="food-display" id="food-display">
      <h2>RICE BRANDS</h2>
      {filteredFood.map((item, index) => (
        <FoodItem
          key={index}
          id={item._id}
          name={item.name}
          description={item.description}
          price={item.price}
          image={item.image}
          stocks={item.stocks}
          notifyAdd={notifyAdd}
          notifyRemove={notifyRemove}
        />
      ))}
    </div>
  );
};

export default FoodDisplay;
