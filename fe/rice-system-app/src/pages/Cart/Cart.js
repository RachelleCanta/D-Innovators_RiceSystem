import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { food_list, assets } from "../../assets/assets";

// * for actions
import axios from "axios";

const Cart = ({ onClose }) => {
  const { cartItems, removeFromCart, addToCart, url } =
    useContext(StoreContext);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showCheckoutConfirmation, setShowCheckoutConfirmation] =
    useState(false);

  const navigate = useNavigate();

  const validPromoCodes = {
    SAVE10: 10,
    SAVE20: 20,
    SAVE30: 30,
  };

  const [productsFromDB, setProductsFromDB] = useState([]);

  const [actualCartItems, setActualCartItems] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);

  const [insufficientStockItems, setInsufficientStockItems] = useState([]);
  const [showInsufficientPopup, setShowInsufficientPopup] = useState(false);

  // * copying the original cart items and adding some additional fiels
  useEffect(() => {
    if (cartItems && cartItems.length > 0 && productsFromDB.length > 0) {
      const updatedCartItems = cartItems.map((item) => {
        const product = productsFromDB.find(
          (fl_item) => fl_item._id === item.food
        );

        return {
          ...item,
          image: `${url}/images/${product.image}`,
          name: product.name,
          price: product.price,
          totalPrice: product.price * item.quantity, // * calc total price based on product price and quantity
        };
      });

      setActualCartItems(updatedCartItems);
    } else {
      setActualCartItems([]); // * this line ensures that it will return an empty array when all the items are removed
      setCartTotalPrice(0);
    }
  }, [cartItems, productsFromDB, url]);

  // * getting the products straight from database bc there's a problem on reloading the storeContext in the cart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url + "/api/food/list");
        if (response && response.data && response.data.data) {
          setProductsFromDB(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    };
    fetchData();
  }, [url]);

  // const getItemInfoFromFoodList = (id, getType) => {
  //   let item_info = null;
  //   const item = productsFromDB.find((fl_item) => fl_item._id === id);

  //   if (!item) {
  //     console.error(`Item with id ${id} not found in foodList`);
  //     return null;
  //   }

  //   switch (getType) {
  //     case "image":
  //       item_info = item.image;
  //       break;
  //     case "price":
  //       item_info = item.price;
  //       break;
  //     case "name":
  //       item_info = item.name;
  //       break;
  //     default:
  //       item_info = null;
  //   }

  //   return item_info;
  // };

  // const handleApplyPromoCode = () => {
  //   if (validPromoCodes[promoCode]) {
  //     setDiscount(validPromoCodes[promoCode]);
  //     toast.success(
  //       `Promo code applied! You got ${validPromoCodes[promoCode]}% off.`
  //     );
  //   } else {
  //     toast.error("Invalid promo code.");
  //     setDiscount(0);
  //   }
  // };

  const handleConfirmClose = () => {
    onClose();
    navigate("/");
  };

  const handleCancelClose = () => {
    setShowCloseConfirmation(false);
  };

  const handleConfirmCheckout = () => {
    setShowCheckoutConfirmation(false);
    console.log("before");
    console.log(actualCartItems);
    console.log(cartTotalPrice);
    navigate("/checkout", {
      state: {
        actualCartItems: actualCartItems,
        cartTotalPrice: cartTotalPrice,
      },
    });
  };

  const handleCancelCheckout = () => {
    setShowCheckoutConfirmation(false);
  };

  const handleInitialPlaceOrderClick = () => {
    // * check here for avaialable stocks
    setInsufficientStockItems([]);
    for (let item of actualCartItems) {
      const product = productsFromDB.find(
        (fl_item) => fl_item._id === item.food
      );
      if (item.quantity > product.stocks) {
        console.log("insufficient alert");
        setInsufficientStockItems((prevItems) => [
          ...prevItems,
          { ...item, stocks: product.stocks },
        ]);
        console.log(item);
        console.log(product);
      }
    }

    if (insufficientStockItems.length <= 0) {
      setShowCheckoutConfirmation(true);
    }
  };

  // * check for insufficient stock upon clicking placeorder
  useEffect(() => {
    if (insufficientStockItems.length > 0) {
      // const insufficients = insufficientStockItems
      //   .map((item) => `${item.name} | Stocks : ${item.stocks}`)
      //   .join(", ");

      // toast.error(
      //   `Cannot proceed with insufficient stock on the following items: `
      // );
      // toast.error(`${insufficients}`);
      setShowCheckoutConfirmation(false);
      setShowInsufficientPopup(true);
    }
  }, [insufficientStockItems]);

  // const calculateTotalPrice = (id, quantity) => {
  //   const item = food_list.find((item) => item._id === id);
  //   return item ? item.price * quantity : 0;
  // };

  // const calculateDiscountedTotal = (total) => {
  //   return total - (total * discount) / 100;
  // };

  // const total = Object.keys(cartItems).reduce((acc, id) => {
  //   const itemQuantity = cartItems[id];
  //   const item = food_list.find((item) => item._id === id);
  //   if (item && itemQuantity > 0) {
  //     return acc + calculateTotalPrice(id, itemQuantity);
  //   }
  //   return acc;
  // }, 0);

  // const discountedTotal = calculateDiscountedTotal(total);

  const handleAddToCart = async (id) => {
    await addToCart(id, 1);
    // if (response) {
    //   setActualCartItems((prevCartItems) =>
    //     prevCartItems.map((item) =>
    //       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    //     )
    //   );
    // }
  };

  const handleRemoveFromCart = async (id) => {
    await removeFromCart(id, 1);
    // const item = actualCartItems.find((item) => item.id === id);
    // if (response) {
    //   if (item && item.quantity === 1) {
    //     // * Remove item from cart if its quantity is 1
    //     setActualCartItems((prevCartItems) =>
    //       prevCartItems.filter((item) => item.id !== id)
    //     );
    //   } else {
    //     // * Decrease item quantity if it's greater than 1
    //     setActualCartItems((prevCartItems) =>
    //       prevCartItems.map((item) =>
    //         item.food === id && item.quantity > 1
    //           ? { ...item, quantity: item.quantity - 1 }
    //           : item
    //       )
    //     );
    //   }
    // }
  };

  // * updating total price when actual cart items changed
  useEffect(() => {
    if (
      actualCartItems &&
      actualCartItems.length > 0 &&
      productsFromDB.length > 0
    ) {
      console.log("actual");
      console.log(actualCartItems);
      setCartTotalPrice(
        actualCartItems.reduce((acc, item) => acc + item.totalPrice, 0)
      );
    } else {
      setCartTotalPrice(0);
    }
  }, [actualCartItems, productsFromDB]);

  return (
    <div className="cart">
      <div className="cart-content">
        <button
          className="exit-button"
          onClick={() => setShowCloseConfirmation(true)}
        >
          <img src={assets.cross_icon} alt="Close" />
        </button>

        <div className="cart-table-div">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {actualCartItems.length > 0 && productsFromDB.length > 0
                ? actualCartItems.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <img src={item.image} alt="" />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.totalPrice}</td>
                        <td>
                          <button
                            className="add-cart-item"
                            onClick={() => handleAddToCart(item.food)}
                          >
                            +
                          </button>
                          <button
                            className="remove-cart-item"
                            onClick={() => handleRemoveFromCart(item.food)}
                          >
                            -
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : actualCartItems.length <= 0 && (
                    <tr className="empty-cart">
                      <td colSpan={6}>Your cart is empty...</td>
                      <td></td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* <div className="cart-items">
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
                    <button onClick={() => handleRemoveFromCart(id)}>
                      Remove
                    </button>
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
        */}

        <div className="cart-actions">
          <button type="button" onClick={() => navigate("/menu")}>
            Back to add more products? Click here!
          </button>
        </div>

        {/* <div className="promo-code">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button onClick={handleApplyPromoCode}>Apply</button>
        </div> */}

        <div className="cart-total">
          <p>Total: ₱{cartTotalPrice}</p>
          {/* <p>Discount: {discount}%</p> */}
          {/* <p>Discounted Total: ₱ {0}</p> */}
          {actualCartItems.length > 0 && (
            <>
              <p className="place-order-button">
                Ready to checkout? Place your order now.
              </p>
              <button
                className="checkout-button"
                onClick={
                  () =>
                    handleInitialPlaceOrderClick() /*setShowCheckoutConfirmation(true)*/
                }
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>

      {insufficientStockItems.length > 0 && showInsufficientPopup && (
        <div className="insufficient-div">
          <h3>Insufficient Stocks</h3>
          <div>
            {insufficientStockItems.map((item, index) => {
              return (
                <div key={index}>
                  <div>
                    Item : <span>{item.name}</span>
                  </div>
                  <div>
                    Available : <span>{item.stocks}</span>
                  </div>
                  <div>
                    On your cart : <span>{item.quantity}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="close-insufficient"
            onClick={() => setShowInsufficientPopup(false)}
          >
            Close
          </button>
        </div>
      )}

      {showCloseConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to close the cart?</p>
          <div className="button-group">
            <button onClick={handleConfirmClose} alt="Close">
              Yes
            </button>
            <button onClick={handleCancelClose}>No</button>
          </div>
        </div>
      )}

      {showCheckoutConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to proceed to checkout?</p>
          <div className="button-group">
            <button onClick={handleConfirmCheckout} alt="Proceed">
              Yes
            </button>
            <button onClick={handleCancelCheckout}>No</button>
          </div>
        </div>
      )}

      {/* <ToastContainer /> */}
    </div>
  );
};

export default Cart;
