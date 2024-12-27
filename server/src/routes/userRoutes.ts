import express , { Request, Response } from 'express';
import UserController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { userRegisterValidation, adminCreateValidation, userLoginValidation, adminLoginValidation } from '../middlewares/validationMiddleware';


const router = express.Router();

router.post('/register', userRegisterValidation, UserController.createUser);
router.post('/create-admin', adminCreateValidation, UserController.createAdmin);
router.post('/login', userLoginValidation, UserController.loginUser);
router.post('/login-admin', adminLoginValidation, UserController.loginAdmin);
router.get('/me', authMiddleware, UserController.getMe);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password/:token', UserController.resetPassword);

export default router;
