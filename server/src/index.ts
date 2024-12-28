import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import database from './services/db';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoute';
import startJobs from './jobs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const db = database.connect();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/registration', registrationRoutes);

//Jobs(Scheduler)
startJobs();


// Server Start
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} adresinde çalışıyor!`);
});