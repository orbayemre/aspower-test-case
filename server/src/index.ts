import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;;

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.get('/', (req: Request, res: Response) => {
  res.send('Merhaba Dünya!');
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} adresinde çalışıyor!`);
});