import deliveryModel from "../models/deliveryModel.js";
import fs from "fs";

const requestDelivery = async (req, res) => {
  try {
    console.log("request for deliver received!");

    const {
      address,
      city,
      country,
      email,
      estimatedDeliveryDate,
      name,
      paymentMethod,
      phone,
      referenceNo,
      zip,
      orderId,
    } = req.body;

    const { filename: receiptImage } = req.file;

    // * check if required fields are present
    if (
      !(
        address ||
        city ||
        country ||
        email ||
        validator.isEmail(email) ||
        estimatedDeliveryDate ||
        validator.isDate(estimatedDeliveryDate) ||
        name ||
        paymentMethod ||
        phone ||
        referenceNo ||
        zip ||
        orderId ||
        receiptImage
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing one/all required fields (orderedItems, totalPrice, date)!",
      });
    }

    console.log(name);
    console.log(receiptImage);

    const newRequestDelivery = new deliveryModel({
      userId: req.userId,
      orderId: orderId,
      estimatedDeliveryDate: estimatedDeliveryDate,
      customerName: name,
      customerAddress: address,
      customerCity: city,
      customerCountry: country,
      customerZip: zip,
      customerEmail: email,
      customerPhone: phone,
      customerPaymentMethod: paymentMethod,
      customerPaymentReferenceNo: referenceNo,
      customerPaymentImage: receiptImage,
    });

    let response = await newRequestDelivery.save();
    if (response) {
      res.json({ success: true, message: "Request delivery success!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getAllDeliveries = async (req, res) => {
  try {
    console.log("getting all deliveries...");
    const deliveries = await deliveryModel.find({});
    res.json({
      success: true,
      message: "Getting Delivery Success!",
      deliveries,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const deleteDelivery = async (orderId) => {
  try {
    console.log("deleting delivery info...", orderId);

    const result = await deliveryModel.findOneAndDelete({ orderId });

    if (!result) {
      throw new Error(`Food item with ID ${orderId} not found.`);
    }

    // * deleting the image
    console.log("deleting receipt image...", orderId);

    const path = "./uploads/" + result.customerPaymentImage;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return false;
      }

      console.log("File removed");
    });

    console.log("del result : ", result);
    return true;
  } catch (error) {
    console.log(error);
    console.error("Error deleting delivery", error);
    throw error;
  }
};

export { requestDelivery, getAllDeliveries, deleteDelivery };
