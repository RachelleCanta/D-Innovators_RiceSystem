import deliveryModel from "../models/deliveryModel.js";
import foodModel from "../models/foodModel.js";
import fs from "fs";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// Add a new food item
const addFood = async (req, res) => {
  if (!req.body.price) {
    return res
      .status(400)
      .json({ success: false, message: "Price is required" });
  }

  const image_filename = req.file.filename;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    stocks: req.body.stocks,
  });

  try {
    // * check duplicate first
    const duplicate = await isDuplicate(food.name, food._id);
    if (duplicate) {
      return res.json({
        success: false,
        message: "Food item with this name already exists",
      });
    }

    await food.save();
    return res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    console.log("Getting all foods...");
    const foods = await foodModel.find({});
    res.json({ success: true, message: "Getting Food Success!", data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// * Remove a food item
const removeFood = async (req, res) => {
  try {
    const foodId = req.body.id;

    // * Check if the food item exists
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }

    // * check orders connected on this food
    let orders = await orderModel.find({
      orderedItems: { $elemMatch: { food: foodId } },
    });

    // console.log("orders:", orders);
    orders.forEach(async (order, index) => {
      // * check delivery connected from that order and delete it
      let delivery = await deliveryModel.findOneAndDelete({ orderId: order._id });
      // console.log(`delivery ${index}:`, delivery);
      if (delivery) {
        // * delete payment receipt
        fs.unlink(`./uploads/${delivery.customerPaymentImage}`, (err) => {
          if (err) console.log(err);
        });
        // * then delete order
        await orderModel.findByIdAndDelete(order._id);
      }
    });

    // * check user cart connected on this food
    let users = await userModel.find({
      cartData: { $elemMatch: { food: foodId } },
    });

    console.log("users that has to be deleted item in cart:", users);
    // * update user cart and remove the item
    users.forEach(async (user, index) => {
      console.log(`user ${index}`, user.cartData);
      let updatedCart = user.cartData.filter((cart) => {
        console.log(typeof foodId);
        console.log(typeof cart.food);
        console.log(`${cart.food} !== ${foodId}`, cart.food != foodId);
        // ! NOTE : !== won't work bc
        // ! cart.food is type object while the other is type foodId
        // ? (u can type cast it to ObjectId())
        return cart.food != foodId;
      });
      await userModel.findByIdAndUpdate(user._id, { cartData: updatedCart });
    });

    // * delete food
    await foodModel.findByIdAndDelete(req.body.id);

    // * delete food image
    fs.unlink(`./uploads/${food.image}`, (err) => {
      if (err) console.log(err);
    });

    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


// * removing item from order, remove order from delivery, from cart then from food collection
// const removeFood = async (req, res) => {
//   try {
//     const foodId = req.body.id;

//     // Check if the food item exists
//     const food = await foodModel.findById(foodId);
//     if (!food) {
//       return res.json({ success: false, message: "Food item not found" });
//     }

//     // Delete deliveries related to this food item
//     await deliveryModel.deleteMany({
//       "orderedItems.food": new mongoose.Types.ObjectId(foodId),
//     });

//     // Find and delete orders related to this food item
//     const ordersWithFood = await orderModel.find({
//       "orderedItems.food": new mongoose.Types.ObjectId(foodId),
//     });
//     for (const order of ordersWithFood) {
//       await orderModel.findByIdAndDelete(order._id);
//     }

//     // Remove the food item from users' carts
//     await userModel.updateMany(
//       { "cartData.food": mongoose.Types.ObjectId(foodId) },
//       { $pull: { cartData: { food: new mongoose.Types.ObjectId(foodId) } } }
//     );

//     // Unlink the associated image file
//     fs.unlink(`uploads/${food.image}`, (err) => {
//       if (err) {
//         console.log(err);
//       }
//     });

//     // Delete the food item from the database
//     await foodModel.findByIdAndDelete(foodId);

//     res.json({ success: true, message: "Product removed" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// * check for duplication of 'name' field, excluding current document
const isDuplicate = async (name, id) => {
  try {
    const existingFood = await foodModel.findOne({
      name: name,
      _id: { $ne: id }, // * exclude current document by its ID
    });

    return existingFood ? true : false;
  } catch (error) {
    console.error("Error checking duplicate:", error);
    throw error;
  }
};

// * update food
const updateFood = async (req, res) => {
  const { updateId, name, description, category, price, stocks } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!updateId || !name || !description || !category || !price || !stocks) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields! (updateId, name, description, category, price, stocks)",
    });
  }

  const updatedFood = {
    name: name,
    description: description,
    price: price,
    category: category,
    stocks: stocks,
  };

  const duplicate = await isDuplicate(name, updateId);

  if (duplicate) {
    return res.json({
      success: false,
      message: "Food item with this name already exists",
    });
  }

  // * Only add the image field if a new image was uploaded
  if (image) {
    updatedFood.image = image;
  }

  try {
    // * Update the food item in the database
    const food = await foodModel.findByIdAndUpdate(updateId, updatedFood);

    if (food) {
      // * If a new image was uploaded, delete the old image
      if (image && food.image) {
        fs.unlink(`uploads/${food.image}`, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          }
        });
      }
      return res.json({ success: true, message: "Product Updated" });
    } else {
      return res.json({ success: false, message: "Cannot update product" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error });
  }
};

// * search for the food item to update
const searchFood = async (req, res) => {
  try {
    console.log("searching for item to update...");

    const { searchFoodId } = req.query;

    console.log("ID TO UPDATE:", searchFoodId);

    if (!searchFoodId) {
      res.status(500).json({
        success: false,
        message: "Missing required field (searchFoodId)!",
      });
      return;
    }

    const food = await foodModel.findById(searchFoodId);
    if (!food) {
      res.json({ success: false, message: "Food Search Failed!" });
    }
    res.json({ success: true, message: "Food Search Success!", food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// * deduct ordered items from stock
const deductOrderedItemsFromStock = async (orderedItems) => {
  try {
    // * an array of promises to update each food item
    const updatePromises = orderedItems.map(async (item) => {
      const { food, quantity } = item;

      // Find food item by itemId
      const foodItem = await foodModel.findById(food);

      if (!foodItem) {
        throw new Error(`Food item with ID ${food} not found.`);
      }

      // * deduct ordered quantity from stocks
      foodItem.stocks -= quantity;

      await foodItem.save();
    });

    // * execute all update promises
    await Promise.all(updatePromises);

    return true;
  } catch (error) {
    console.error("Error updating stocks:", error);
    throw error; // Propagate error to handle it further
  }
};

// * add ordered items to stock
const addOrderedItemsToStock = async (orderedItems) => {
  try {
    // * an array of promises to update each food item
    const updatePromises = orderedItems.map(async (item) => {
      const { food, quantity } = item;

      // Log the quantity to check its value
      console.log(`Adding quantity: ${quantity} to food item: ${food}`);

      // Find food item by itemId
      const foodItem = await foodModel.findById(food);

      if (!foodItem) {
        throw new Error(`Food item with ID ${food} not found.`);
      }

      // Log current stock before addition
      console.log(`Current stock for food item ${food}: ${foodItem.stocks}`);

      // * add ordered quantity to stocks
      foodItem.stocks = parseInt(foodItem.stocks) + parseInt(quantity);

      // Log new stock after addition
      console.log(`New stock for food item ${food}: ${foodItem.stocks}`);

      await foodItem.save();
    });

    // * execute all update promises
    await Promise.all(updatePromises);

    return true;
  } catch (error) {
    console.error("Error updating stocks:", error);
    throw error; // Propagate error to handle it further
  }
};

export {
  addFood,
  listFood,
  removeFood,
  deductOrderedItemsFromStock,
  addOrderedItemsToStock,
  searchFood,
  updateFood,
};
