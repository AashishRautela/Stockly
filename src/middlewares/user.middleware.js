import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '../utils/common/index.js';
import { AppError } from '../utils/errors/index.js';
import { UserValidations } from '../validations/index.js';

export const validateRegisterUserRqst = async (req, res, next) => {
  try {
    const errorResponse = ErrorResponse();

    if (!req.body || Object.keys(req.body).length === 0) {
      errorResponse.message = 'Validation failed while creating user';
      errorResponse.error = new AppError(
        ['Request body is required and cannot be empty'],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    const { error, value } = UserValidations.registerUserSchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: false,
        allowUnknown: false,
        presence: 'required'
      }
    );

    if (error) {
      // Gather all error messages from Joi
      const messages = error.details.map((d) => d.message);

      errorResponse.message = 'Validation failed while creating user';
      errorResponse.error = new AppError(messages, StatusCodes.BAD_REQUEST);

      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    // assign sanitized data
    req.body = value;
    next();
  } catch (err) {
    const errorResponse = ErrorResponse();
    errorResponse.message = 'Unexpected validation error';
    errorResponse.error = new AppError(
      [err.message || 'Internal server error'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};
