import mongoose, { mongo } from "mongoose"

// * Define the structure of the items in the cart
const cartItemSchema = new mongoose.Schema({
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: [cartItemSchema], default: [] }, // * use an array instead of 1 object
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;