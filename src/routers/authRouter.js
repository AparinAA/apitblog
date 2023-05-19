import { Router } from "express";
import { authController } from '../controllers/authController.js';
import { check } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = new Router();

authRouter.post('/signup', [
    check("username", 'Username cannot be empty').notEmpty(),
    check("password", 'Password have to 4-10 symbol').isLength({ min: 4, max: 8 }),

], authController.singup);
authRouter.post('/login', authController.login);
authRouter.get('/users', authMiddleware, authController.users);

export default authRouter;