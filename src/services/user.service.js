import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/errors/appError.js';
import prisma from '../config/database.js';
import bcrypt from 'bcrypt';

export const registerUser = async (data) => {
  try {
    const { email, password, firstName, lastName = '', status = '' } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExist = await prisma.user.findUnique({
      where: { email }
    });

    if (userExist) {
      throw new AppError(
        ['User exists with same email'],
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileColor: true
      }
    });
    return user;
  } catch (error) {
    console.log('error -->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while creating user'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
