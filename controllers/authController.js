import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/catchAsyncError.js";
import { userSchema } from "../middleware/validation.js";
import { userModel } from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// generate access and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh token"
    );
  }
};

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

  const { refreshToken, accessToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  //send cookies
  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  // Send the token to the client
  res.status(200).json({ accessToken });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECTET
    );

    const user = await userModel.findById(decodedToken?._id);
    console.log("User", user);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
    console.log("refreshToken");

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
