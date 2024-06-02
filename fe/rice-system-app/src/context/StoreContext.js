import React, { createContext, useState, useEffect } from "react";
import axios from "axios"

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(null);
  const url = "http://localhost:4000";
  const[food_list,setFoodList] = useState([])

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

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      totalAmount += cartItems[item];
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");
    setFoodList(response.data.data)
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    async function loadData() {
      await fetchFoodList()
    }
  }, []);

  const contextValue = {
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token, 
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
