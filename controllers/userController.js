import express from "express";
import { userModel } from "../models/userModel.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
const router = express.Router();
