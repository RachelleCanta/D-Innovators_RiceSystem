import React from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { food_list } from "../../assets/assets";

const FoodDisplay = ({ category }) => {
  const filteredFood =
    category === "All"
      ? food_list
      : food_list.filter((food) => food.category === category);

  return (
    <div className="food-display" id="food-display">
      <h2>TOP RICE BRANDS</h2>
      {filteredFood.map((item,index) => (
        <FoodItem 
          key={index} 
          id={item._id} 
          name={item.name} 
          description={item.description} 
          price={item.price} 
          image={item.image} 
          stock={item.stock}
        />
      ))}
    </div>
  );
};

export default FoodDisplay;
