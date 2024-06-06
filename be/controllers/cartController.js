import userModel from "../models/userModel.js"

// add items to user cart
// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        let item = cartData.find(item => item.itemId.toString() === req.body.itemId);

        if (!item) {
            const price = req.body.price; // Ensure price is sent in the request body
            if (price === undefined) {
                return res.json({ success: false, message: "Price is required" });
            }
            cartData.push({ itemId: req.body.itemId, quantity: 1, price });
        } else {
            item.quantity += 1;
        }
        await userData.save();
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// remove items from user cart
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

// fetch user cart data
const getCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {addToCart,removeFromCart,getCart}