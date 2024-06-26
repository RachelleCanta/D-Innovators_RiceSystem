import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  searchFood,
  updateFood,
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.put("/update", upload.single("image"), updateFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/list", listFood);
foodRouter.get("/search", searchFood);

export default foodRouter;
