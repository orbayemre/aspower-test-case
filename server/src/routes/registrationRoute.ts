import express , { Request, Response } from 'express';
import RegistrationController from '../controllers/registrationController';
import authMiddleware from '../middlewares/authMiddleware';
import { userRegisterValidation, adminCreateValidation, userLoginValidation, adminLoginValidation } from '../middlewares/validationMiddleware';


const router = express.Router();

router.post('/register',authMiddleware, RegistrationController.registerEvent);
router.get('/get-registration-number/:id', RegistrationController.getRegistrationNumberByEventId);

export default router;
