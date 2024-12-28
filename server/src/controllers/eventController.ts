import { Request, Response, RequestHandler } from 'express';
import { UserRole } from "../models/userModel";
import { Event } from "../models/eventModel";

class EventController{

    static createEvent: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            if(res.locals.user.role != UserRole.Admin){
                return res.status(403).json({ status: 'Forbidden'}); 
            }

            const { title, description, location, startDate, endDate, sessions, tags, categories, isOnline } = req.body;
           
            
            const existingEvent = await Event.findOne({ title });
            if (existingEvent) {
                return res.status(400).json({ status: "Bad Request", message: 'Event already exists' });
            }

            const newEvent = new Event({ 
                title, 
                description, 
                location, 
                startDate,
                endDate,
                sessions,
                tags,
                categories,
                isOnline
            });
            await newEvent.save();

            //Konuşmacı görsellerinin eklenmesini sağlayacak istekleri atabilmek için ön tarafa konuşmacı id değerleri geri gönderirilir.
            var speakersId : Array<Object> = [];
            if(newEvent.sessions){
                newEvent.sessions.map((session) =>{
                    speakersId.push(session.speaker._id);
                });
            }
            res.status(201).json({ status: 'success', speakersId: speakersId,  message: 'Event created successfully'}); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static getEventsByDate: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            const { start_date, end_date } = req.body;
            const startDate = new Date(start_date + 'Z');
            const endDate = new Date(end_date + 'Z');
            
            const events = await Event.find({
                'startDate': { $gte: startDate, $lte: endDate },
            }).sort({ 'startDate': 1 }).select('-createdAt -updatedAt -__v');

            return res.status(200).json({ status: 'success', events: events });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static getEventById: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            const { id } = req.params;

            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ status: "Not Found", message: 'Event  not found' });
            }
            return res.status(200).json({ status: 'success', event: event });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    static updateEvent: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            if(res.locals.user.role != UserRole.Admin){
                return res.status(403).json({ status: 'Forbidden'}); 
            }

            const { id, title, description, location, startDate, endDate, sessions, tags, categories, isOnline } = req.body;
            
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ status: "Not Found", message: 'Event not found' });
            }

            
            if(title) { event.title = title; }
            if(description) { event.description = description; }
            if(location) { event.location = location; }
            if(startDate) { event.startDate = startDate; }
            if(endDate) { event.endDate = endDate; }
            if(sessions) { event.sessions = sessions; }
            if(tags) { event.tags = tags; }
            if(categories) { event.categories = categories; }
            if(isOnline) { event.isOnline = isOnline; }
            await event.save();

            //Konuşmacı görsellerinin eklenmesini sağlayacak istekleri atabilmek için ön tarafa konuşmacı id değerleri geri gönderirilir.
            var speakersId : Array<Object> = [];
            if(event.sessions){
                event.sessions.map((session) =>{
                    speakersId.push(session.speaker._id);
                });
            }
            return res.status(200).json({ status: 'success', speakersId: speakersId,  message: 'Event updated' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static deleteEvent: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            if(res.locals.user.role != UserRole.Admin){
                return res.status(403).json({ status: 'Forbidden'}); 
            }

            const { id } = req.body;
            
            const result = await Event.deleteOne({ _id: id });
    
            if (result.deletedCount === 1) {
                return res.status(200).json({ status: 'success', message: 'Event deleted' });
            }
            return res.status(404).json({ status: "Not Found", message: 'Event not found' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    static uploadSpeakerImage: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            if(res.locals.user.role != UserRole.Admin){
                return res.status(403).json({ status: 'Forbidden'}); 
            }

            const { id } = req.params;
            const imagePath = req?.file?.destination.split("/client")[1] + "/" + req?.file?.filename

            const event = await Event.findOne({ 'sessions.speaker._id': id });

            if (!event) {
              return res.status(404).json({ status: "Not Found", message: 'Speaker not found' });
            }

            event.sessions.forEach(session => {
                if (session.speaker._id.toString() === id) {
                    if(imagePath) {
                        session.speaker.image = imagePath; 
                    }
                    else{
                        return res.status(500).json({ message: 'An error occurred while uploading the image' });
                    }
                }
            });
            
            await event.save();

            res.status(200).json({ status: 'success', event:event,  message: 'Image uploaded successfully'}); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default EventController;