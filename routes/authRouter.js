import express from "express";
const router = express.Router();

import {
  login,
  refreshAccessToken,
  signup,
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

router.route("/signup").post(signup);
router.route("/login").post(login);

// secured routes
router.route("/refresh-token").post(refreshAccessToken);

export default router;
