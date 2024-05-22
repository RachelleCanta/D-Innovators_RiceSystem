import React, { useContext, useState, useEffect } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodItem = ({ id, name, description, price, image, stock }) => {
  const { addToCart, removeFromCart, cartItems } = useContext(StoreContext);
  const [quantity, setQuantity] = useState(1);
  const [itemQuantity, setItemQuantity] = useState(cartItems[id] || 0);

  useEffect(() => {
    setItemQuantity(cartItems[id] || 0);
  }, [cartItems, id]);

  const handleAddToCart = () => {
    addToCart(id, quantity);
    setQuantity(1);
    toast.success(`${name} added to cart.`);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(id);
    toast.error(`${name} removed from cart.`);
  };

  return (
    <div className="food-item">
      <img src={image} alt={name} />
      <div className="food-info">
        <h2>{name}</h2>
        <p>{description}</p>
        <p>₱ {price.toFixed(2)}</p>
        <p>Stock: {stock}</p>
      </div>
      <div className="food-actions">
        {itemQuantity > 0 && (
          <>
            <button onClick={handleRemoveFromCart}>Remove</button>
            <span>{itemQuantity}</span>
          </>
        )}
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          max={stock}
        />
        <button onClick={handleAddToCart}>Add</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FoodItem;
