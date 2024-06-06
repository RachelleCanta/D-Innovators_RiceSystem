import React, { useContext, useState, useEffect } from 'react';
import './FoodItem.css';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, description, price, image, stocks, notifyAdd, notifyRemove }) => {
  const { addToCart, removeFromCart, cartItems } = useContext(StoreContext);
  const [quantity, setQuantity] = useState(1);
  const url = 'http://localhost:4001';
  const [itemQuantity, setItemQuantity] = useState(cartItems[id] || 0);

  useEffect(() => {
    setItemQuantity(cartItems[id] || 0);
  }, [cartItems, id]);

  const handleAddToCart = () => {
    addToCart(id, quantity);
    setQuantity(1);
    notifyAdd(name);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(id);
    notifyRemove(name);
  };

  return (
    <div className='food-item'>
      <img src={url+"/images/" +image} alt={name} />
      <div className='food-info'>
        <h2>{name}</h2>
        <p>{description}</p>
        <p>₱ {price.toFixed(2)}</p>
        <p>Stock: {stocks}</p>
      </div>
      <div className='food-actions'>
        {itemQuantity > 0 && (
          <>
            <button onClick={handleRemoveFromCart}>Remove</button>
            <span>{itemQuantity}</span>
          </>
        )}
        <input
          type='number'
          min='1'
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default FoodItem;
