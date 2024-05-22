import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { billingInfo, orderDate, estimatedDeliveryDate } = location.state;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="order-confirmation">
      <h2>Order Tracking Information</h2>
      <p>Order placed on: {formatDate(orderDate)}</p>
      <p>Estimated delivery date: {formatDate(estimatedDeliveryDate)}</p>
      <h3>Delivery Information:</h3>
      <p>Name: {billingInfo.name}</p>
      <p>Address: {billingInfo.address}</p>
      <p>City: {billingInfo.city}</p>
      <p>Zip: {billingInfo.zip}</p>
      <p>Country: {billingInfo.country}</p>
      <p>Email: {billingInfo.email}</p>
      <p>Phone: {billingInfo.phone}</p>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default OrderConfirmation;
