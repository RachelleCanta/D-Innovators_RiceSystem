import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRoute from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";

import orderRouter from "./routes/orderRoute.js";
import deliveryRouter from "./routes/deliveryRoute.js";

// app config
const app = express();
const port = 4001;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// Logging middleware to log the request URL
app.use("/images", (req, res, next) => {
    console.log("Request for image:", req.url);
    next();
}, express.static('uploads'));

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRoute);
app.use("/api/cart",cartRouter);

app.use("/api/order", orderRouter);
app.use("/api/deliver", deliveryRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
