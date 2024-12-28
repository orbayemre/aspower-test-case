import express , { Request, Response } from 'express';
import EventController from '../controllers/eventController';
import authMiddleware from '../middlewares/authMiddleware';
import { uploadSpeakerImage } from '../middlewares/multerMiddleware';
import { createEventValidation, updateEventValidation } from '../middlewares/validationMiddleware';


const router = express.Router();

router.post('/create', authMiddleware, createEventValidation, EventController.createEvent);
router.post('/get-events', EventController.getEventsByDate);
router.get('/get-event/:id', EventController.getEventById);
router.post('/update', authMiddleware, updateEventValidation, EventController.updateEvent);
router.post('/delete', authMiddleware, EventController.deleteEvent);
router.post('/speaker-image/:id', authMiddleware, uploadSpeakerImage.single('image'), EventController.uploadSpeakerImage);

export default router;
