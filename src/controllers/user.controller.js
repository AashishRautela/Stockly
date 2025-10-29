import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { UserService } from '../services/index.js';
import { StatusCodes } from 'http-status-codes';

export const registerUser = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const data = req.body;

  const user = await UserService.registerUser(data);

  successResponse.data = user;
  successResponse.message = 'User Registered Successfully';

  return res.status(StatusCodes.CREATED).json(successResponse);
});
