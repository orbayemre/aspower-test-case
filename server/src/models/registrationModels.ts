import { Schema, model, Document } from 'mongoose';

interface IRegistration extends Document {
  user: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  registrationDate: Date; 
}

const registrationSchema = new Schema<IRegistration>({
  user: { type: Schema.Types.ObjectId,ref: 'User',  required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  registrationDate: { type: Date, default: Date.now},
});

const Registration = model<IRegistration>('Registration', registrationSchema,"registrations");

export { Registration };
