🌤️ WEATHERCODE

A modern full-stack weather application built using React + Vite on the frontend and Node.js + Express on the backend.
The app provides real-time weather updates, hourly forecast, location search, and a clean beautiful UI.

📁 Project Structure
WEATHERCODE/
│
├── client/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/               # Backend (Node.js + Express)
│   ├── api/
│   │   └── weather.js
│   ├── server.js
│   ├── package.json
│   └── .env (ignored)
│
├── .gitignore
└── README.md

✨ Features
🌦️ Weather Dashboard

Displays temperature, humidity, wind speed, visibility

Changes UI based on weather condition

Clean and minimal design

🕒 Hourly Forecast

Detailed hourly weather updates

Scrollable forecast section

🔍 Location Search

Search any city globally

Fetches weather instantly using backend API

⚙️ Full-stack Setup

Separate client and server folders

Backend handles weather API securely

Frontend uses Axios + Context for state

🛠️ Tech Stack :
Frontend - 

React (Vite)

JavaScript (ES6+)

Tailwind CSS

Context API

Axios

Backend -

Node.js

Express.js

Weather API (OpenWeather)

dotenv

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/WEATHERCODE.git
cd WEATHERCODE

📦 Install Dependencies
🔹 Client
cd client
npm install

🔹 Server
cd ../server
npm install

⚙️ Environment Variables

Create a .env file inside server/:

API_KEY=your_weather_api_key
PORT=5000

▶️ Run the App
Backend:
cd server
npm run dev

Frontend:
cd client
nodemon server.js


Frontend runs at →
http://localhost:5173/

Backend runs at →
http://localhost:5000/

📡 API Endpoint
GET /api/weather?city=<cityname>

Returns:

temperature

humidity

wind

visibility

weather condition

etc.

🧩 Git Ignore Rules

Your .gitignore excludes:

client/node_modules/
client/dist/
client/.env
server/node_modules/
server/.env

🤝 Contributing

Pull requests are welcome!
Feel free to fork and improve the UI, add features, or optimize the backend.

🧑‍💻 Author

Ayush Kumar
Developer — Full Stack (React + Node.js)
