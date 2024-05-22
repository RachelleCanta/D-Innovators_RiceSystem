import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(currentDate.getDate() + 2);

    console.log('Order placed:', billingInfo);
    navigate('/payment-method', {
      state: {
        billingInfo,
        orderDate: currentDate.toISOString(),
        estimatedDeliveryDate: estimatedDeliveryDate.toISOString()
      }
    });
  };

  return (
    <div className="place-order">
      <h2>Delivery Information</h2>
      <form onSubmit={handleSubmit} className="billing-form">
        <label>
          Name:
          <input type="text" name="name" value={billingInfo.name} onChange={handleChange} required />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={billingInfo.address} onChange={handleChange} required />
        </label>
        <label>
          City:
          <input type="text" name="city" value={billingInfo.city} onChange={handleChange} required />
        </label>
        <label>
          Zip:
          <input type="text" name="zip" value={billingInfo.zip} onChange={handleChange} required />
        </label>
        <label>
          Country:
          <input type="text" name="country" value={billingInfo.country} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={billingInfo.email} onChange={handleChange} required />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={billingInfo.phone} onChange={handleChange} required />
        </label>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default PlaceOrder;
