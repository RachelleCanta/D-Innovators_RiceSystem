import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://D-Innovators:Rachellejoycanta123@cluster0.89l4chs.mongodb.net/d-innovators_ricesystem').then(()=>console.log("DB Connected"));
}
