import express from 'express';
import cors from 'cors';
import { getWeatherData } from './api/weather.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/weather', getWeatherData);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});