// cartController.js
import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        let item = cartData.find(item => item.itemId.toString() === req.body.itemId);

        // Check if price is provided in the request
        const { itemId, price } = req.body;
        if (!price) {
            return res.status(400).json({ success: false, message: "Price is required" });
        }

        if (!item) {
            cartData.push({ itemId, quantity: 1, price });
        } else {
            item.quantity += 1;
        }
        await userData.save();
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        let item = cartData.find(item => item.itemId.toString() === req.body.itemId);

        if (item) {
            if (item.quantity > 0) {
                item.quantity -= 1;
            }
            if (item.quantity === 0) {
                cartData = cartData.filter(item => item.itemId.toString() !== req.body.itemId);
            }
        }
        userData.cartData = cartData;
        await userData.save();
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { addToCart, removeFromCart, getCart };


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
