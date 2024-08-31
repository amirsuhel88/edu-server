import Joi from "joi";

// Define the Joi validation schema for login
export const loginSchema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.min": "Username must be no more than 20 characters",
      "any.regex": "Username must not contain special character",
    }),
  email: Joi.string().email().trim().lowercase().messages({
    "string.email": "Invalid email format",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});
