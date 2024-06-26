import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Menu from "./components/Menu/Menu";
// import StoreProvider from './context/StoreContext';
import { StoreContext } from "./context/StoreContext";
import ContactUs from "./components/ContactUs/ContactUs";
import AppDownload from "./components/AppDownload/AppDownload";
import PaymentMethod from "./pages/PaymentMethod/PaymentMethod";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderList from "./components/OrderList/OrderList";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [cartPrices, setCartPrices] = useState([]);

  const [additionals, setAdditionals] = useState([]);

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token"));

  const [foodList, setFoodList] = useState([]);

  const url = "http://localhost:4001";

  // ? what is the purpose of this method
  const handleCloseCart = () => {
    console.log("Cart closed");
  };

  // * fetch food/products from db
  // useEffect(() => {
  //   const fetchFoodList = async () => {
  //     try {
  //       const response = await axios.get(url + "/api/food/list");
  //       setFoodList(response.data.data);
  //     } catch (error) {
  //       console.error("Failed to fetch food list:", error);
  //     }
  //   };
  //   fetchFoodList();
  // }, []);

  // * separate the function so that we can call this again after successful order to update stocks
  const fetchFoodList = useCallback(async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  }, [url]);

  // * fetch food/products from db on mount
  useEffect(() => {
    fetchFoodList();
  }, [fetchFoodList]);

  // * fetch cart items from db
  useEffect(() => {
    async function fetchCartData() {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await axios.post(
            url + "/api/cart/get",
            {},
            { headers: { token } }
          );
          setCartItems((prevCartItems) => response.data.cartData);
        } catch (error) {
          console.error("Failed to load cart data:", error);
        }
      }
    }
    fetchCartData();
  }, [token]);

  const addToCart = async (itemId, quantity = 1) => {
    if (!token) {
      return;
    }

    setCartItems((prevItems) => {
      if (Array.isArray(prevItems)) {
        const itemIndex = prevItems.findIndex((item) => item.food === itemId);
        if (itemIndex !== -1) {
          // * item exists
          const updatedItems = [...prevItems];
          updatedItems[itemIndex].quantity += quantity;
          return updatedItems;
        } else {
          // * item does not exist
          return [...prevItems, { food: itemId, quantity: quantity }];
        }
      } else {
        return [{ food: itemId, quantity: quantity }];
      }
    });

    if (token) {
      try {
        let response = await axios.post(
          url + "/api/cart/add",
          { itemId, quantity: quantity, userId: token },
          { headers: { token } }
        );
        return response;
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId, quantity = 1) => {
    setCartItems((prevItems) => {
      if (Array.isArray(prevItems)) {
        const itemIndex = prevItems.findIndex((item) => item.food === itemId);
        if (itemIndex !== -1) {
          const updatedItems = [...prevItems];
          const newQuantity = updatedItems[itemIndex].quantity - quantity;

          // * remove item completely if qty is 0 or less
          if (newQuantity <= 0) {
            updatedItems.splice(itemIndex, 1);
          } else {
            // * update quantity otherwise
            updatedItems[itemIndex].quantity = newQuantity;
          }
          return updatedItems;
        }
        // * item not found, return prevItems as is
        return prevItems;
      } else {
        // * prevItems is not an array, return an empty array
        return [];
      }
    });

    if (token) {
      try {
        const response = await axios.post(
          `${url}/api/cart/remove`,
          { itemId, quantity: quantity, userId: token },
          { headers: { token } }
        );
        return response;
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
      }
    }
  };

  // * FOR TESTING PURPOSES ONLY
  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  const getTotalCartAmount = () => {};

  return (
    <StoreContext.Provider
      value={{
        foodList,
        cartItems,
        cartPrices,
        additionals,
        addToCart,
        removeFromCart,
        user,
        token,
        setToken,
        getTotalCartAmount,
        url,
        setCartItems,
        fetchFoodList,
      }}
    >
      {/* <StoreProvider> */}
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <div className="app">
        <BrowserRouter basename="/">
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/cart" element={<Cart onClose={handleCloseCart} />} />
            <Route path="/orderList" element={<OrderList />} />

            <Route path="/checkout" element={<PlaceOrder />} />

            <Route path="/payment-method" element={<PaymentMethod />} />

            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/contact-us" element={<ContactUs />} />
            {/* <Route path="/app" element={<AppDownload />} /> */}
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </div>
      <Footer />
      {/* </StoreProvider> */}
    </StoreContext.Provider>
  );
};

export default App;
