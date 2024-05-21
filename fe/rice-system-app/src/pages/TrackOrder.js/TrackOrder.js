import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TrackOrder.css';

const TrackOrder = () => {
  const location = useLocation();
  const { billingInfo, orderDate, estimatedDeliveryDate } = location.state;
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBack = () => {
    // Navigate to the home page ('/')
    navigate('/');
  };

  return (
    <div className="track-order">
      <h2>Order Tracking Information</h2>
      <p>Order placed on: {formatDate(orderDate)}</p>
      <p>Estimated delivery date: {formatDate(estimatedDeliveryDate)}</p>
      <h3>Billing Information:</h3>
      <p>Name: {billingInfo.name}</p>
      <p>Address: {billingInfo.address}</p>
      <p>City: {billingInfo.city}</p>
      <p>State: {billingInfo.state}</p>
      <p>Zip: {billingInfo.zip}</p>
      <p>Country: {billingInfo.country}</p>
      <p>Email: {billingInfo.email}</p>
      <p>Phone: {billingInfo.phone}</p>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default TrackOrder;
