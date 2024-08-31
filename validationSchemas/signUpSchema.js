import Joi from "joi";

export const usernameValidation = Joi.string()
  .min(2)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/)
  .messages({
    "string.min": "Username must be no more than 20 characters",
    "any.required": "Password is required",
    "any.regex": "Username must not contain special character",
  });

// Define the Joi validation schema
export const userValidationSchema = Joi.object({
  firstName: Joi.string().min(1).max(20).required().trim().messages({
    "string.min": "First name must be at least 1 character long",
    "string.max": "First name must be no more than 20 characters long",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().min(1).max(20).required().trim().messages({
    "string.min": "Last name must be at least 1 character long",
    "string.max": "Last name must be no more than 20 characters long",
    "any.required": "Last name is required",
  }),

  email: Joi.string().email().required().trim().lowercase().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password should have a minimum length of 6 characters",
    "any.required": "Password is required",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit number",
      "any.required": "Phone number is required",
    }),

  dob: Joi.date().less("now").required().messages({
    "date.less": "Date of birth must be in the past",
    "any.required": "Date of birth is required",
  }),
});
