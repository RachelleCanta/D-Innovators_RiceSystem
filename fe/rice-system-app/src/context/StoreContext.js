// import React, { createContext, useEffect, useState } from "react";
// import axios from "axios";

import { createContext } from "react";
export const StoreContext = createContext();

// const StoreContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState({});

//   const [cartPrices, setCartPrices] = useState({});
//   const [additionals, setAdditionals] = useState({});

//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [foodList, setFoodList] = useState([]);

//   const url = "http://localhost:4001";

//   const addToCart = async (itemId, quantity = 1) => {
//     // setCartItems((prev) => ({
//     //   ...prev,
//     //   [itemId]: (prev[itemId] || 0) + quantity,
//     // }));
//     // if (token) {
//     //   try {
//     //     await axios.post(
//     //       url + "/api/cart/add",
//     //       { itemId, userId: token },
//     //       { headers: { token } }
//     //     );
//     //   } catch (error) {
//     //     console.error("Failed to add item to cart:", error);
//     //   }
//     // }
//   };

//   const removeFromCart = async (itemId) => {
//     // setCartItems((prev) => {
//     //   const newCount = (prev[itemId] || 0) - 1;
//     //   if (newCount <= 0) {
//     //     const { [itemId]: _, ...rest } = prev;
//     //     return rest;
//     //   }
//     //   return { ...prev, [itemId]: newCount };
//     // });

//     // if (token) {
//     //   try {
//     //     await axios.post(
//     //       url + "/api/cart/remove",
//     //       { itemId, userId: token },
//     //       { headers: { token } }
//     //     );
//     //   } catch (error) {
//     //     console.error("Failed to remove item from cart:", error);
//     //   }
//     // }
//     // setCartItems((prev) => {
//     //   const newCount = (prev[itemId] || 0) - 1;
//     //   if (newCount <= 0) {
//     //     const { [itemId]: _, ...rest } = prev;
//     //     return rest;
//     //   }
//     //   return { ...prev, [itemId]: newCount };
//     // });
//     // if (token) {
//     //   try {
//     //     await axios.post(
//     //       url + "/api/cart/remove",
//     //       { itemId, userId: token },
//     //       { headers: { token } }
//     //     );
//     //   } catch (error) {
//     //     console.error("Failed to remove item from cart:", error);
//     //   }
//     // }
//   };

//   const getTotalCartAmount = () => {
//     return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
//       const item = foodList.find((food) => food._id === itemId);
//       return total + (item ? item.price * quantity : 0);
//     }, 0);
//   };

//   const fetchFoodList = async () => {
//     try {
//       const response = await axios.get(url + "/api/food/list");
//       setFoodList(response.data.data);
//     } catch (error) {
//       console.error("Failed to fetch food list:", error);
//     }
//   };

//   // * get saved cart items from db
//   const loadCartData = async (token) => {
//     try {
//       const response = await axios.post(
//         url + "/api/cart/get",
//         {},
//         { headers: { token } }
//       );
//       setCartItems(response.data.cartData);
//       setCartPrices(response.data.cartPrices);
//       setAdditionals(response.data.additionals);
//     } catch (error) {
//       console.error("Failed to load cart data:", error);
//     }
//   };

//   useEffect(() => {
//     async function loadData() {
//       await fetchFoodList();
//     }
//     loadData();
//   }, []);

//   useEffect(() => {
//     async function fetchCartData() {
//       const storedToken = localStorage.getItem("token");
//       if (storedToken) {
//         setToken(storedToken);
//         try {
//           const response = await axios.post(
//             url + "/api/cart/get",
//             {},
//             { headers: { token } }
//           );
//           setCartItems(response.data.cartData);
//         } catch (error) {
//           console.error("Failed to load cart data:", error);
//         }
//       }
//     }
//     fetchCartData();
//   }, [cartItems, url, token]);

//   const contextValue = {
//     foodList,
//     cartItems,
//     cartPrices,
//     additionals,
//     addToCart,
//     removeFromCart,
//     user,
//     token,
//     setToken,
//     getTotalCartAmount,
//     url,
//     setCartItems,
//   };

//   return (
//     <StoreContext.Provider value={contextValue}>
//       {props.children}
//     </StoreContext.Provider>
//   );
// };

// export default StoreContextProvider;
