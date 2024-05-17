import React, { createContext, useState } from "react";

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const addToCart = (itemId, quantity = 1) => {
    setCartItems((prevItems) => {
      const updatedCart = { ...prevItems };
      updatedCart[itemId] = (updatedCart[itemId] || 0) + quantity;
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedCart = { ...prevItems };
      if (updatedCart[itemId] && updatedCart[itemId] > 0) {
        updatedCart[itemId] -= 1;
      }
      return updatedCart;
    });
  };

  return (
    <StoreContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
