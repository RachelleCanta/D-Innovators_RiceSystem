import foodModel from "../models/foodModel.js";
import fs from 'fs';

const addFood = async (req, res) => {
    // Check if the price field is provided in the request body
    if (!req.body.price) {
        return res.status(400).json({ success: false, message: "Price is required" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price, // Ensure price field is included
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
}

// all food list
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})      
    }
}

//remove food item

const removeFood = async (req,res) =>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Product removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"}) 
    }
}

export {addFood,listFood,removeFood};











//Original COde Below


// import foodModel from "../models/foodModel.js";
// import fs from 'fs'

// const addFood = async (req,res) => {

//     let image_filename = `${req.file.filename}`;

//     const food = new foodModel({
//         name:req.body.name,
//         description:req.body.description,
//         price:req.body.price,
//         category:req.body.category,
//         image:image_filename
//     })
//     try {
//         await food.save();
//         res.json({success:true,message:"Product Added"})
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:"Error"})
//     }
// }

// export {addFood}