import express from 'express';
import { UserController } from '../../../controllers/index.js';
import { UserMiddleware } from '../../../middlewares/index.js';

const router = express.Router();

router.post(
  '/',
  UserMiddleware.validateRegisterUserRqst,
  UserController.registerUser
);

export default router;
