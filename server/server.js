import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getWeatherData } from './api/weather.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow local dev + Vercel frontend
app.use(cors());
app.use(express.json());

// Weather route
app.get('/api/weather', getWeatherData);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
