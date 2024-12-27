import { Schema, model, Document } from 'mongoose';

//Konuşmacı Arayüzü
interface Speaker {
  name: string;
  bio: string;
  image: string;
  socialLinks: string[]; 
}

//Oturum Arayüzü
interface Session {
  title: string;
  description: string;
  speaker: Speaker;
  startTime: Date;  
  endTime: Date;    
}

//Etkinlik Arayüzü
interface IEvent extends Document {
  title: string;
  description: string;
  location: string;  
  startDate: Date;   
  endDate: Date;    
  sessions: Session[]; 
  tags: string[];     
  categories: string[]; 
  registrationLink: string;  
  isOnline: boolean; 
}

//Konuşmacı Şeması
const speakerSchema = new Schema<Speaker>({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String , default: null},
  socialLinks: { type: [String], default: [] },
});

//Oturum Şeması
const sessionSchema = new Schema<Session>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  speaker: { type: speakerSchema, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

//Etkinlik Şeması
const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  sessions: { type: [sessionSchema], required: true },
  tags: { type: [String], default: [] },
  categories: { type: [String], default: [] },
  registrationLink: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
}, { timestamps: true });

const Event = model<IEvent>('Event', eventSchema,"events");

export { Event };
