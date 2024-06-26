import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"; //authentication
import bcrypt from "bcrypt"; //password
import validator from "validator";

import "dotenv/config";

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    //if password not match

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // if password is matching
    const token = createToken(user._id, req);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // checking is user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // encrypting/hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyToken = (req, res, next) => {
  // * get token from Authorization header
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided" });
  }

  // * verify JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    console.log("Token verified. User ID:", decoded.id); // Debug statement
    // * verification is successful, attach userId to request object
    req.userId = decoded.id;
    next();
  });
};

const getAllUsers = async (req, res) => {
  try {
    console.log("getting all users...");
    let users = await userModel.find({});

    res.json({ success: true, message: "Getting User Success!", users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

export { loginUser, registerUser, verifyToken, getAllUsers };
