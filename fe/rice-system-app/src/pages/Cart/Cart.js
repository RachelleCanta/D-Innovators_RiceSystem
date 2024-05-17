import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { food_list } from '../../assets/assets';
import { assets } from '../../assets/assets';

const Cart = ({ onClose }) => {
  const { cartItems, removeFromCart } = useContext(StoreContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmClose = () => {
    onClose(); // Call the onClose function to close the cart
    setShowConfirmation(false); // Close the confirmation dialog
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  const calculateTotalPrice = (id, quantity) => {
    const item = food_list.find((item) => item._id === id);
    return item.price * quantity;
  };

  return (
    <div className="cart">
      <div className="cart-content">
        <button className="exit-button" onClick={() => setShowConfirmation(true)}>
          <img src={assets.cross_icon} alt="Close" />
        </button>

        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <br />
          <hr />
          {Object.keys(cartItems).map((id, index) => {
            const itemQuantity = cartItems[id];
            const item = food_list.find((item) => item._id === id);
            if (itemQuantity > 0 && item) {
              return (
                <div key={index} className="cart-items-item">
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <p>{itemQuantity}</p>
                  <p>${calculateTotalPrice(id, itemQuantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(id)}>Remove</button>
                </div>
              );
            }
          })}
        </div>
      </div>
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to close the cart?</p>
          <button onClick={handleConfirmClose} alt="Close ">Yes</button>
          <button onClick={handleCancelClose}>No</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
