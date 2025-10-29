import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.'
    }),

  password: Joi.string().min(8).max(50).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.'
  }),

  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long.',
    'any.required': 'First name is required.'
  }),

  lastName: Joi.string().max(50).allow(null, '').optional()
}).required();
