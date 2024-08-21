import express from "express";
const router = express.Router();

import { signup } from "../controllers/authController.js";

router.route("/signup").post(signup);

export default router;
