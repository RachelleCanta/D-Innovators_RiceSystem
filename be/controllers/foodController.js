import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add a new food item
const addFood = async (req, res) => {
    if (!req.body.price) {
        return res.status(400).json({ success: false, message: "Price is required" });
    }

    const image_filename = req.file.filename;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
        stocks: req.body.stocks
    });

    try {
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
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove a food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addFood, listFood, removeFood };