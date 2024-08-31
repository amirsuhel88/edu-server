import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/catchAsyncError.js";
// import { userSchema } from "../middleware/validation.js";
import { userModel } from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  usernameValidation,
  userValidationSchema,
} from "../validationSchemas/signUpSchema.js";
import { loginSchema } from "../validationSchemas/loginSchema.js";

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

//Sign up Controller
export const signup = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, password, phone, dob } =
    req.body;

  // Validate the input using Joi
  const { error } = userValidationSchema.validate({
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
  });

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  // Check if the username is valid (no special characters)
  const { error: usernameError } = usernameValidation.validate(username);
  if (usernameError) {
    throw new ApiError(400, usernameError.details[0].message);
  }

  // Check if the user already exists
  const existedUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Combine firstName and lastName into fullName
  const fullName = `${firstName} ${lastName}`;

  // Create a new user in the database
  const user = await userModel.create({
    username: username.toLowerCase(),
    firstName,
    lastName,
    fullName,
    email,
    password,
    phone,
    dob,
  });

  // Remove sensitive information from the response
  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  // Check if the user was created successfully
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});
// //signup a new user
// export const signup = catchAsyncError(async (req, res, next) => {
//   const { error } = userSchema.validate(req.body); //username, email, password validation
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }
//   try {
//     const newUser = new userModel(req.body);
//     await newUser.save().then((savedUser) => {
//       console.log(savedUser);
//       res.status(201).json({ message: "user is successfully registered" });
//     });
//   } catch (err) {
//     console.log(error);
//     res.status(500).json({ msg: "Unable to save new user" });
//   }
// });

export const login = asyncHandler(async (req, res) => {
  //req body ->data

  const { email, username, password } = req.body;

  // console.log("username", username);
  // console.log("email", email);

  //Joi validation
  const { error } = loginSchema.validate({
    email,
    password,
    username,
  });

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  //username or email
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  //find the user
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  //password check
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  //access and refresh token

  const { refreshToken, accessToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  //send cookies
  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// //login
// export const login = catchAsyncError(async (req, res, next) => {
//   const { email, password } = req.body;

//   // Find the user by email
//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   // Check if the password is correct
//   const isPasswordValid = await user.comparePassword(password);
//   if (!isPasswordValid) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   const { refreshToken, accessToken } =
//     await generateAccessTokenAndRefreshToken(user._id);

//   //send cookies
//   const loggedInUser = await userModel
//     .findById(user._id)
//     .select("-password -refreshToken");

//   // Send the token to the client
//   res.status(200).json({ accessToken });
// });

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
    // console.log("User", user);

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
    // console.log("refreshToken");

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

export const logoutUser = asyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out Successfully"));
});

// Password update controller
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = userModel.findById(req.user?._id);

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});
