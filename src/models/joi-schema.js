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
    }),
});