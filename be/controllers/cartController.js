// cartController.js
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    // *  Check if required fields is present in the request
    const { itemId, quantity, userId } = req.body;

    console.log("qty to add : ", quantity);

    if (!itemId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (itemId, userId)!",
      });
    }

    let userData = await userModel.findById(userId);
    let itemFromCart = userData.cartData.find(
      (item) => item.food.toString() === itemId
    );

    if (!itemFromCart) {
      // * Add new item to the cart
      userData.cartData.push({ food: itemId, quantity: quantity });
    } else {
      // * Update quantity if item is already in the cart
      itemFromCart.quantity += quantity;
    }

    await userData.save();
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    // *  Check if required fields is present in the request
    const { itemId, quantity, userId } = req.body;

    console.log("qty to remove : ", quantity);

    if (!itemId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (itemId, userId)!",
      });
    }

    let userData = await userModel.findById(userId);
    let itemFromCart = userData.cartData.find(
      (item) => item.food.toString() === itemId
    );

    if (itemFromCart) {
      // * decrease the qty by 1
      if (itemFromCart.quantity > 0) {
        itemFromCart.quantity -= quantity;
      }
      // * remove the item in the cartData
      if (itemFromCart.quantity === 0) {
        userData.cartData = userData.cartData.filter(
          (item) => item.food.toString() !== itemId
        );
      }
    }

    await userData.save();
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    // let cartData = await userData.cartData;
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeOrderedItemFromCart = async (orderedItems, userId) => {
  try {
    let userData = await userModel.findById(userId);

    // Ensure userData is found
    if (!userData) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    // Iterate over ordered items and remove them from the cart
    for (const item of orderedItems) {
      const { food } = item;

      const foodItem = await foodModel.findById(food);
      if (!foodItem) {
        throw new Error(`Food item with ID ${food} not found.`);
      }

      // Remove item from cart
      userData.cartData = userData.cartData.filter(
        (cartItem) => cartItem.food.toString() !== food
      );

      // Save userData after each modification to avoid parallel saves
      await userData.save();
    }

    return true;
  } catch (error) {
    console.error("Error removing items from cart:", error);
    throw error;
  }
};

export { addToCart, removeFromCart, getCart, removeOrderedItemFromCart };

// import userModel from "../models/userModel.js";

// // Add items to user cart
// const addToCart = async (req, res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = userData.cartData;
//         let item = cartData.find(item => item.itemId.toString() === req.body.itemId);

//         if (!item) {
//             const { itemId, price } = req.body;
//             if (!price) {
//                 return res.status(400).json({ success: false, message: "Price is required" });
//             }
//             cartData.push({ itemId, quantity: 1, price });
//         } else {
//             item.quantity += 1;
//         }
//         await userData.save();
//         res.json({ success: true, message: "Added to cart" }); // Correct response here
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error" });
//     }
// }

// // Remove items from user cart
// const removeFromCart = async (req, res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = userData.cartData;
//         let item = cartData.find(item => item.itemId.toString() === req.body.itemId);

//         if (item) {
//             if (item.quantity > 0) {
//                 item.quantity -= 1;
//             }
//             if (item.quantity === 0) {
//                 cartData = cartData.filter(item => item.itemId.toString() !== req.body.itemId);
//             }
//         }
//         userData.cartData = cartData;
//         await userData.save();
//         res.json({ success: true, message: "Removed From Cart" });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" });
//     }
// }

// // Fetch user cart data
// const getCart = async (req, res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId)
//         let cartData = await userData.cartData;
//         res.json({ success: true, cartData })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// export { addToCart, removeFromCart, getCart };
