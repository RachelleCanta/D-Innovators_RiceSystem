import "./Promotions.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext.js";
import { toast } from "react-toastify";

const Promotions = () => {
  const { url, foodList, addToCart, cartItems } = useContext(StoreContext);

  const [frequentItemsForPromotion, setFrequentItemsForPromotion] = useState(
    []
  );

  const handleBundleAddToCart = async (items) => {
    if (!localStorage.getItem("token")) {
      return;
    }

    try {
      console.log("Adding to cart", items);

      const addToCartPromises = items.map(async (item) => {
        const response = await addToCart(item, 1);
        return response;
      });

      const results = await Promise.all(addToCartPromises);

      // * Collect success and error messages
      const successMessages = [];
      const errorMessages = [];

      results.forEach((response) => {
        if (response.data.success) {
          successMessages.push(response.data.message);
        } else {
          errorMessages.push(response.data.message);
        }
      });

      // * Display toast based on results
      if (successMessages.length > 0) {
        toast.success(`Bundle Added To Cart`);
      }

      if (errorMessages.length > 0) {
        toast.error(`Failed to add bundle to cart`);
      }
    } catch (error) {
      console.error("Error Bundle :", error);
      toast.error(
        "Error adding bundle to cart. Please try again later.",
        error
      );
    }
  };

  // * get promotions to list
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(url + "/api/order/apriori");
        console.log("response", response);
        let arrItems = response.data.promotions.frequentItemsForPromotion;
        setFrequentItemsForPromotion(arrItems);
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

  // * Function to compute total price of items in a bundle
  const computeBundleTotal = (items) => {
    let total = 0;
    items.forEach((itemId) => {
      const food = getFoodById(itemId);
      total += food.price;
    });
    return total.toFixed(2); // Adjust as needed based on your currency format
  };

  // * log received promotions list
  useEffect(() => {
    console.log("ff");
    console.log(frequentItemsForPromotion);
    console.log(foodList);
  }, [frequentItemsForPromotion, foodList]);

  return (
    <>
      {frequentItemsForPromotion.length > 0 && (
        <div className="promotions-parent-container">
          <h1>Discover Our Best-Selling Bundles!</h1>
          <div className="bundles">
            {frequentItemsForPromotion.map((bundle, index) => (
              <div key={index} className="bundle">
                <div className="bundle-totals">
                  <span>Bundle {index + 1}</span>
                  <span>P{computeBundleTotal(bundle.items)}</span>
                </div>
                <div className="product-pairs">
                  {bundle.items.map((item, index) => (
                    <div key={index} className="product">
                      <img
                        src={url + "/images/" + getFoodById(item).image}
                        alt={`Food ${getFoodById(item).name}`}
                      />
                      <div className="product-totals">
                        <span>{getFoodById(item).name}</span>
                        <span>P{getFoodById(item).price}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="actions">
                  <button
                    onClick={() => handleBundleAddToCart(bundle.items)}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Promotions;
