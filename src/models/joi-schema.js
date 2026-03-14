import Joi from "joi";

export const testSchema = Joi.object({
  testInput: Joi.string().min(3).max(5).required(),
  testNumber: Joi.number().integer().min(1).max(100).required(),
  testEmail: Joi.string().email().required(),
});

// TODO: add proper checks for password (password strength)
export const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  passwordRepeat: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }), // AI help
});

export const pointSchema = Joi.object({
  owner: Joi.string(),
  pos: {
    lat: Joi.number().min(-90).max(90).required(), // -90 to 90
    lon: Joi.number().min(-180).max(180).required(), // -180 to 180
  },
  data: {
    name: Joi.string().min(2).max(20).required(),
    description: Joi.string().max(200),
    categories: Joi.array().items(Joi.string().alphanum().min(1).max(20)), // AI help
  },
});

// Schema for the add-point form
export const addPointFormSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
  name: Joi.string().min(2).max(20).required(),
  description: Joi.string().max(200),
  categories: Joi.array().allow("").optional(), // not ready yet
});

export const pointUpdateSchema = Joi.object({
  pos: {
    lat: Joi.number().min(-90).max(90).required(), // -90 to 90
    lon: Joi.number().min(-180).max(180).required(), // -180 to 180
  },
  data: {
    name: Joi.string().min(2).max(20).required(),
    description: Joi.string().max(200),
    categories: Joi.array().items(Joi.string().alphanum().min(1).max(20)), // AI help
  },
});
