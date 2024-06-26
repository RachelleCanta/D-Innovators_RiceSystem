import express from "express";
import {
  requestDelivery,
  getAllDeliveries,
} from "../controllers/deliveryController.js";
import { verifyToken } from "../controllers/userController.js";
import multer from "multer";

const deliveryRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

deliveryRouter.post(
  "/requestDelivery",
  upload.single("receiptImage"),
  verifyToken,
  requestDelivery
);

deliveryRouter.get("/deliveries", getAllDeliveries);

export default deliveryRouter;
