import express from "express";
import { userModel } from "../models/userModel.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
const router = express.Router();

export const addUser = catchAsyncError(async (req, res, next) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save().then((savedUser) => {
      console.log(savedUser);
      res.status(201).json({ msg: "User is successfully created" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to save new user" });
  }
});
