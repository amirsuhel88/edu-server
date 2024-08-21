import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  role: Joi.string().required(), // Added phone validation
});

// Login validation
export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
