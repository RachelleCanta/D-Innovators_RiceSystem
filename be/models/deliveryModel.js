import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  estimatedDeliveryDate: { type: String, required: true },
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerCity: { type: String, required: true },
  customerCountry: { type: String, required: true },
  customerZip: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerPaymentMethod: { type: String, required: true },
  customerPaymentReferenceNo: { type: String, required: true },
  customerPaymentImage: { type: String, required: true },
});

const deliveryModel =
  mongoose.models.delivery || mongoose.model("delivery", deliverySchema);

export default deliveryModel;
