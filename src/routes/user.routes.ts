import { Router, Request, Response } from 'express';
import UserController from '../controllers/user.controller';
import UserService from '../services/user.service';
import UserRepository from '../repositories/user.repository';
import { JWT } from '../utils/jwt';
import { AuthMiddleware } from '../middlewares/authMiddleware';
const userRouter = Router();
const jwt = new JWT()
const userRepository = new UserRepository()
const userService = new UserService(userRepository, jwt)
const userController = new UserController(userService);
const authMiddleware = new AuthMiddleware(userRepository, jwt)

userRouter.post('/login', userController.login);

userRouter.post('/logout', authMiddleware.authenticateJWT, userController.logout);

export default userRouter;