import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { food_list, assets } from '../../assets/assets';

const Cart = ({ onClose }) => {
  const { cartItems, removeFromCart, addToCart } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showCheckoutConfirmation, setShowCheckoutConfirmation] = useState(false);
  const navigate = useNavigate();

  const validPromoCodes = {
    SAVE10: 10,
    SAVE20: 20,
    SAVE30: 30,
  };

  const handleApplyPromoCode = () => {
    if (validPromoCodes[promoCode]) {
      setDiscount(validPromoCodes[promoCode]);
      toast.success(`Promo code applied! You got ${validPromoCodes[promoCode]}% off.`);
    } else {
      toast.error('Invalid promo code.');
      setDiscount(0);
    }
  };

  const handleConfirmClose = () => {
    onClose(); 
    navigate('/'); 
  };

  const handleCancelClose = () => {
    setShowCloseConfirmation(false);
  };

  const handleConfirmCheckout = () => {
    setShowCheckoutConfirmation(false);
    navigate('/checkout'); 
  };

  const handleCancelCheckout = () => {
    setShowCheckoutConfirmation(false);
  };

  const calculateTotalPrice = (id, quantity) => {
    const item = food_list.find((item) => item._id === id);
    return item ? item.price * quantity : 0;
  };

  const calculateDiscountedTotal = (total) => {
    return total - (total * discount / 100);
  };

  const total = Object.keys(cartItems).reduce((acc, id) => {
    const itemQuantity = cartItems[id];
    const item = food_list.find((item) => item._id === id);
    if (item && itemQuantity > 0) {
      return acc + calculateTotalPrice(id, itemQuantity);
    }
    return acc;
  }, 0);

  const discountedTotal = calculateDiscountedTotal(total);

  const handleAddToCart = (id) => {
    addToCart(id);
    const item = food_list.find((item) => item._id === id);
    toast.success(`Added ${item.name} to cart.`);
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    const item = food_list.find((item) => item._id === id);
    toast.error(`Removed ${item.name} from cart.`);
  };

  return (
    <div className="cart">
      <div className="cart-content">
        <button className="exit-button" onClick={() => setShowCloseConfirmation(true)}>
          <img src={assets.cross_icon} alt="Close" />
        </button>

        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Actions</p>
          </div>
          <br />
          <hr />
          {Object.keys(cartItems).map((id) => {
            const itemQuantity = cartItems[id];
            const item = food_list.find((item) => item._id === id);
            if (itemQuantity > 0 && item) {
              return (
                <div key={id} className="cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₱ {item.price.toFixed(2)}</p>
                  <p>{itemQuantity}</p>
                  <p>₱ {calculateTotalPrice(id, itemQuantity).toFixed(2)}</p>
                  <div className="item-actions">
                    <button onClick={() => handleRemoveFromCart(id)}>Remove</button>
                    <button onClick={() => handleAddToCart(id)}>Add</button>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="promo-code">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button onClick={handleApplyPromoCode}>Apply</button>
        </div>

        <div className="cart-actions">
          <button type="button" onClick={() => navigate('/menu')}>Back to add more products? Click here!</button>
        </div>

        <div className="cart-total">
          <p>Total: ₱ {total.toFixed(2)}</p>
          <p>Discount: {discount}%</p>
          <p>Discounted Total: ₱ {discountedTotal.toFixed(2)}</p>
          <p className="place-order-button">Ready to checkout? Place your order now.</p>
          <button className="checkout-button" onClick={() => setShowCheckoutConfirmation(true)}>
            Place Order
          </button>
        </div>
      </div>
      
      {showCloseConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to close the cart?</p>
          <div className="button-group">
            <button onClick={handleConfirmClose} alt="Close">Yes</button>
            <button onClick={handleCancelClose}>No</button>
          </div>
        </div>
      )}

      {showCheckoutConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to proceed to checkout?</p>
          <div className="button-group">
            <button onClick={handleConfirmCheckout} alt="Proceed">Yes</button>
            <button onClick={handleCancelCheckout}>No</button>
          </div>
        </div>
      )}
        
      <ToastContainer />
    </div>
  );
};

export default Cart;
