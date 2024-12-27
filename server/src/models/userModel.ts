import { Schema, model, Document } from 'mongoose';

// Kullanıcı Rolleri
enum UserRole {
    Admin = 'admin',
    User = 'user',
}

// Kullanıcı Arayüzü
interface IUser extends Document {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: UserRole;
}

// Kullanıcı Şeması
const userSchema = new Schema<IUser>({
    name: { type: String },
    surname: { type: String },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.User},
}, { timestamps: true });

const User = model<IUser>('User', userSchema,'users');

export { User, UserRole };
