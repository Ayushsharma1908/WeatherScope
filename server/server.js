import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getWeatherData } from './api/weather.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://weather-scope-chi.vercel.app", // Vercel frontend
    "http://localhost:3000"                 // Local development
  ]
}));
app.use(express.json());

app.get('/api/weather', getWeatherData);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
