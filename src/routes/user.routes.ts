import { Router, Request, Response } from 'express';
import UserController from '../controllers/user.controller';
import UserService from '../services/user.service';
import UserRepository from '../repositories/user.repository';
import JWT from '../utils/jwt';
import { AuthMiddleware } from '../middlewares/authMiddleware';
const userRouter = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware()

userRouter.post('/login', userController.login);

userRouter.post('/logout', authMiddleware.authenticateJWT, userController.logout);

export default userRouter;