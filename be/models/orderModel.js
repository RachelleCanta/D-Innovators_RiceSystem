import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  totalOrderedPrice: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  orderedItems: {
    type: [
      {
        food: { type: String, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    required: true,
  },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
