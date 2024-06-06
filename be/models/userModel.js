import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true } // Ensure price is required
});

const userSchema = new mongoose.Schema({
  cartData: { type: [cartItemSchema], default: [] },
  // other user fields...
});

const userModel = mongoose.model('User', userSchema);
export default userModel;


// import mongoose, { mongo } from "mongoose"

// const userSchema = new mongoose.Schema({
//     name: { type:String, required:true },
//     email: { type:String, required:true, unique:true },
//     password: { type:String, required:true },
//     cartData: { type:Object, default:{} }
// }, { minimize:false })

// const userModel = mongoose.models.user || mongoose.model("user",userSchema);

// export default userModel;

