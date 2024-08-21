import mongoose, { Schema } from "mongoose";
import hashPassword from "../middleware/hashPassword.js";
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
});

userSchema.pre("save", hashPassword); //using hashpassword middleware
export const userModel = mongoose.model("User", userSchema);
