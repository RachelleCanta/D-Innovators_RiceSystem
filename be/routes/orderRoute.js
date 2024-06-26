import express from "express";
import {
  requestOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getUserOrder,
  runApriori,
} from "../controllers/orderController.js";
import { verifyToken } from "../controllers/userController.js";

const orderRouter = express.Router();

orderRouter.get("/orders", getAllOrders);
orderRouter.get("/userOrder", verifyToken, getUserOrder);
orderRouter.post("/requestOrder", verifyToken, requestOrder);
orderRouter.put("/status", updateOrder);
orderRouter.delete("/deleteOrder", deleteOrder);

orderRouter.get("/apriori", runApriori);

export default orderRouter;
