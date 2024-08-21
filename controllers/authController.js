import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/catchAsyncError.js";
import { userSchema } from "../middleware/validation.js";
import { userModel } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

//signup a new user
export const signup = catchAsyncError(async (req, res, next) => {
  const { error } = userSchema.validate(req.body); //username, email, password validation
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const newUser = new userModel(req.body);
    await newUser.save().then((savedUser) => {
      console.log(savedUser);
      res.status(201).json({ message: "user is successfully registered" });
    });
  } catch (err) {
    console.log(error);
    res.status(500).json({ msg: "Unable to save new user" });
  }
});

//login
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check if the password is correct
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate a JWT
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  // Send the token to the client
  res.status(200).json({ token });
});
