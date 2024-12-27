import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  _id: string;
  email: string;
  role: string;
}

//Token değerini çözer ve içindeki bilgileri geri dönderir.
const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    // Token süresi kontrolü
    const currentTimestamp = Math.floor(Date.now() / 1000); 
    if (decoded.exp && decoded.exp < currentTimestamp) {
      return null; 
    }

    // Token geçerliyse, payload'ı döndürür
    return {
      _id: decoded._id as string,
      email: decoded.email as string,
      role: decoded.role as string,
    };
  } catch (error) {
    return null; // Eğer token doğrulaması başarısızsa, null döner
  }
};

//Token değerini kontrol ederek isteği yönlendir.
const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: "Unauthorized", message: 'Token not provided' });
  }

  const decoded = decodeToken(token);

  if (!decoded) {
    return res.status(401).json({ status: "Unauthorized", message: 'Token has expired'  });
  }

  res.locals.user = decoded;

  next(); 
};

export default authMiddleware;
