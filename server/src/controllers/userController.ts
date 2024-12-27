import { Request, Response, RequestHandler } from 'express';
import { User, UserRole } from "../models/userModel";
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

class UserController {

    //Kullanıcı kayıt işlemini gerçekleştirir.
    static createUser: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            const { name, surname, email, password } = req.body;
            
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            const newUser = new User({ 
                name, 
                surname, 
                email, 
                password: createHash("md5").update(password).digest("hex"),
            });
            await newUser.save();

            const token = jwt.sign(
                { _id: newUser._id, email: newUser.email, role: newUser.role}, 
                process.env.JWT_SECRET as string, 
                { expiresIn: process.env.JWT_EXPIRES_IN as string }
            );

            res.status(201).json({ status: 'success', token, data: { user: newUser } }); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    //Admin kayıt işlemini gerçekleştirir.
    static createAdmin: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            const { name, surname, email, password } = req.body;
           
            const existingAdmin = await User.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: 'User already exists' });
            }
            

            const newUser = new User({ 
                name, 
                surname, 
                email, 
                password: createHash("md5").update(password).digest("hex"),
                role : UserRole.Admin
            });
            await newUser.save();

            const token = jwt.sign(
                { _id: newUser._id, email: newUser.email, role: newUser.role }, 
                process.env.JWT_SECRET as string, 
                { expiresIn: process.env.JWT_EXPIRES_IN as string }
            );

            res.status(201).json({ status: 'success', token, data: { user: newUser } }); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    //Kullanıcı giriş işlemini gerçekleştirir.
    static loginUser: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            const { email, password } = req.body;
           
            const user = await User.findOne({ email });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            if (user.password !== createHash("md5").update(password).digest("hex")) {
                return  res.status(401).json({message: 'Password is wrong' });;
            }
            

            const token = jwt.sign(
                { _id: user._id, email: user.email, role: user.role }, 
                process.env.JWT_SECRET as string, 
                { expiresIn: process.env.JWT_EXPIRES_IN as string }
            );

            res.status(201).json({ status: 'success', token, data: { user: user } }); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    //Admin giriş işlemini gerçekleştirir.
    static loginAdmin: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            const { email, password } = req.body;
           
            const admin = await User.findOne({ email });
            
            if (!admin) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            if (admin.password !== createHash("md5").update(password).digest("hex")) {
                return  res.status(401).json({message: 'Password is wrong' });;
            }
            

            const token = jwt.sign(
                { _id: admin._id, email: admin.email, role: admin.role }, 
                process.env.JWT_SECRET as string, 
                { expiresIn: process.env.JWT_EXPIRES_IN as string }
            );

            res.status(201).json({ status: 'success', token, data: { user: admin } }); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    //Kullanıcın verisi geri dönderilir.
    static getMe: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        try {
            const user = await User.findById(res.locals.user._id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
          
            return res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    //Kullanıcı mail adresine şifre yenileme linki gönderilir.
    static forgotPassword: RequestHandler = async (req: Request, res : Response): Promise<any> => {

        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.outlook.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.AUTH_EMAIL_USER,
                    pass: process.env.AUTH_EMAIL_PASS,
                },
            });
            
            const { email } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            
            const resetToken = jwt.sign(
                { email }, 
                process.env.JWT_SECRET as string,  
                { expiresIn: process.env.JWT_FORGOT_TOKEN_EXPIRES_IN as string }
            );
            const resetLink = `http://localhost:8080/user/reset-password/${resetToken}`;

            const mailOptions = {
                from: process.env.AUTH_EMAIL_USER,
                to: email,
                subject: 'Password Reset',
                html: `<p>Please click the following link to reset your password:</p><p>${resetLink}</p>`,
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ status: 'success', message: 'Password reset link sent to your email' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    //Token kontrol edilerek şifre yenileme işlemi yapılır.
    static resetPassword: RequestHandler = async (req: Request, res : Response): Promise<any> => {
        const { token } = req.params;
        const { password } = req.body;
        var email = "";

        try {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
                email = decoded.email;
                
            } catch (error : any) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ status: "Unauthorized", message: 'Token has expired' });
                }
                return res.status(401).json({ status: "Unauthorized" , message: 'Invalid token' });
            }

            const user = await User.findOne({ email: email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.password =  createHash("md5").update(password).digest("hex");
            await user.save();

            return res.status(200).json({ status: 'success',  message: 'Password reset successful' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
}

export default UserController;
