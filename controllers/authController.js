// import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import catchAsyncError from "../middleware/catchAsyncError.js";
import { userSchema } from "../middleware/validation.js";
import { userModel } from "../models/userModel.js";

// // Generate a new UUID
// const uniqueId = uuidv4();

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
