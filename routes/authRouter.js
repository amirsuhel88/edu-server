import express from "express";
const router = express.Router();

import {
  login,
  refreshAccessToken,
  signup,
  logoutUser,
  changeCurrentPassword,
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

router.route("/signup").post(signup);
router.route("/login").post(login);

// secured routes
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

export default router;
