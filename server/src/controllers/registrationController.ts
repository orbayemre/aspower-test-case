import { Request, Response, RequestHandler } from 'express';
import { User, UserRole } from "../models/userModel";
import { Event } from "../models/eventModel";
import { Registration } from "../models/registrationModels";

class RegistrationController{

    
    static registerEvent: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            
            if(res.locals.user.role != UserRole.User){
                return res.status(403).json({ status: 'Forbidden'}); 
            }

            const existingUser = await User.findById(res.locals.user._id);
            if (!existingUser) {
                return res.status(401).json({ status: "Unauthorized", message: 'Unauthorized action' });
            }

            const { eventId } = req.body;
            const existingEvent = await Event.findById(eventId);
            if (!existingEvent) {
                return res.status(404).json({ status: "Not Found", message: 'Event not found' });
            }
            
            const newRegistration = new Registration({ 
                user : res.locals.user._id,
                event : eventId
            });
            await newRegistration.save();
           
            res.status(200).json({ status: 'success', message: 'You have successfully registered for the event.'}); 

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    static getRegistrationNumberByEventId: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {

            const { id } = req.params;
            const existingEvent = await Event.findById(id);
            if (!existingEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            
            const registrations = await Registration.find({event:id});
           
            res.status(200).json({ status: 'success', registrationNumber: registrations.length}); 

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    
    static getRegistrationsByUserId: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {

            const existingUser = await User.findById(res.locals.user._id);
            if (!existingUser) {
                return res.status(401).json({ status: "Unauthorized", message: 'Unauthorized action' });
            }
            
            const registrations = await Registration.find({user:res.locals.user._id});
           
            res.status(200).json({ status: 'success', registrations: registrations}); 

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

export default RegistrationController;