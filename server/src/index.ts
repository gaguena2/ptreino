import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';
import { workoutRoutes } from './routes/workout';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
