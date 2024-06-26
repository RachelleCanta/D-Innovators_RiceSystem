import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const location = useLocation();
  const { actualCartItems, cartTotalPrice } = location.state;

  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    email: "",
    phone: "",
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
    estimatedDeliveryDate.setDate(currentDate.getDate() + 3);

    console.log("Order placed:", billingInfo);
    console.log("after :", actualCartItems);
    console.log("after :", cartTotalPrice);

    navigate("/payment-method", {
      state: {
        billingInfo: billingInfo,
        orderDate: currentDate,
        estimatedDeliveryDate: estimatedDeliveryDate,
        actualCartItems: actualCartItems,
        cartTotalPrice: cartTotalPrice,
      },
    });
  };

  return (
    <div className="place-order">
      <h2>Delivery Information</h2>
      <form onSubmit={handleSubmit} className="billing-form">
        <label>
          Name:
          <input
            required
            type="text"
            name="name"
            value={billingInfo.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <input
            required
            type="text"
            name="address"
            value={billingInfo.address}
            onChange={handleChange}
          />
        </label>
        <label>
          City:
          <input
            required
            type="text"
            name="city"
            value={billingInfo.city}
            onChange={handleChange}
          />
        </label>
        <label>
          Zip:
          <input
            required
            type="text"
            name="zip"
            value={billingInfo.zip}
            onChange={handleChange}
          />
        </label>
        <label>
          Country:
          <input
            required
            type="text"
            name="country"
            value={billingInfo.country}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            required
            type="email"
            name="email"
            value={billingInfo.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            required
            type="text"
            name="phone"
            value={billingInfo.phone}
            onChange={handleChange}
          />
        </label>

        <div className="button-container">
          <button type="button" onClick={() => navigate("/cart")}>
            Back
          </button>
          <button type="submit">Place Order</button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
