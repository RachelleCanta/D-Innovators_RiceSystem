import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";

// * test
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodItem = ({
  id,
  name,
  description,
  price,
  image,
  stocks,
  // * test
  // notifyAdd,
  // notifyRemove,
}) => {
  const { addToCart, removeFromCart, cartItems, url, foodList } =
    useContext(StoreContext);

  const [quantity, setQuantity] = useState(1);

  const [itemQuantity, setItemQuantity] = useState(0);

  const [recommendedProductList, setRecommendedProductList] = useState([]);

  const [recommendedProduct, setRecommendedProduct] = useState();

  const [showRecommendation, setShowRecommendation] = useState(false);

  // * test
  // const notifyAdd = (message, name) => toast.success(`${name} ${message}`);
  // const notifyRemove = (message, name) => toast.error(`${name} ${message}`);

  // * sets the current quantity of the item from the cart in db
  useEffect(() => {
    if (Array.isArray(cartItems)) {
      const item = cartItems.find((item) => item.food === id);
      if (item) {
        console.log("updated qty : " + item.quantity);
        setItemQuantity(item.quantity);
      }
    }
  }, []);

  // * get promotions to list
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(url + "/api/order/apriori");
        console.log("response", response);
        let arrItems = response.data.promotions.highConfidencePromotions;
        setRecommendedProductList(arrItems);
      } catch (error) {
        console.error("Failed to fetch promotions list:", error);
      }
    };

    fetchPromotions();
  }, [url]);

  // * Function to get food object by ID
  const getFoodById = (id) => {
    console.log("find id:", id);
    return (
      foodList.find((item) => item._id === id) || {
        id: id,
        name: "Unknown Food",
        category: "Unknown Category",
        price: 0,
      }
    );
  };

  // * gets recommended based on antecedent id
  function findFirstConsequentByAntecedent(antecedentId, recommendations) {
    for (let recommendation of recommendations) {
      if (recommendation.antecedent.includes(antecedentId)) {
        return recommendation.consequent[0]; // * return the first consequent ID found
      }
    }
    return null; // * return null if no match is found
  }

  const handleAddRecommendedToCart = async () => {
    let response = await addToCart(recommendedProduct, 1);
    console.log(response);
    if (response.data.success) {
      toast.success(`Recommended product added to cart`);
      setShowRecommendation(false);
    } else {
      toast.error(`Cannot add recommended product right now...`);
    }
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      setQuantity(1);
    }

    let response = await addToCart(id, quantity);
    console.log(response);
    if (response) {
      setItemQuantity(
        (prevCartItemQuantity) => prevCartItemQuantity + quantity
      );
      console.log("res", response);
      // notifyAdd(response.data.message, name);
      toast.success(`${name} ${response.data.message}`);
      setQuantity(1);

      let recommended = findFirstConsequentByAntecedent(
        id,
        recommendedProductList
      );
      if (recommended) {
        setRecommendedProduct(recommended);
        setShowRecommendation(true);
      }
    }
  };

  const handleRemoveFromCart = async () => {
    if (quantity <= 0) {
      setQuantity(1);
    }

    let response = null;

    if (itemQuantity - quantity > 0) {
      setItemQuantity(
        (prevCartItemQuantity) => prevCartItemQuantity - quantity
      );
      response = await removeFromCart(id, quantity);
    } else {
      setItemQuantity(0);
      response = await removeFromCart(id, itemQuantity);
    }

    if (response) {
      console.log("res", response);
      // notifyRemove(response.data.message, name);
      toast.error(`${name} ${response.data.message}`);
      setQuantity(1);
      console.log("response", response.data.message);
    }
  };

  return (
    <>
      <div className="food-item">
        <img src={url + "/images/" + image} alt={name} />
        <div className="food-info">
          <h2>{name}</h2>
          <p>{description}</p>
          <p>₱ {price.toFixed(2)}</p>
          <p>Stock: {stocks}</p>
        </div>
        <div className="food-actions">
          {itemQuantity > 0 && (
            <>
              <button onClick={handleRemoveFromCart}>Remove</button>
              <span>{itemQuantity}</span>
            </>
          )}
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          />
          <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
      {showRecommendation && (
        <div className="recommendation-div">
          <h2>You might also like this!</h2>
          <div key={0} className="recommendation-product">
            <img
              src={url + "/images/" + getFoodById(recommendedProduct).image}
              alt={`Food `}
            />
            <div className="product-totals">
              <span>{getFoodById(recommendedProduct).name}</span>
              <span>P{getFoodById(recommendedProduct).price}</span>
            </div>
          </div>
          <div className="recommendation-actions">
            <button
              onClick={() => setShowRecommendation(false)}
              className="next-time-button"
            >
              Next Time
            </button>
            <button
              onClick={handleAddRecommendedToCart}
              className="sure-button"
            >
              Sure
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodItem;
