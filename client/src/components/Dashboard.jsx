import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdWbSunny,
  MdWbCloudy,
  MdCloudQueue,
  MdGrain,
  MdThunderstorm,
  MdArrowBack,
  MdLogout,
  MdWbCloudy as MdCloudy,
} from "react-icons/md";
import { Droplets, Wind, Eye, CloudRain } from "lucide-react";

const Dashboard = ({ onLogout, user }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(state?.weatherData || null);
  const [selectedHour, setSelectedHour] = useState(null);

  const displayWeather = selectedHour || weatherData;

  // 🔥 Fetch weather data with date/time parameters
  useEffect(() => {
    if (!weatherData && state?.location) {
      const fetchWeather = async () => {
        try {
          const url = `https://weatherscope-gw2z.onrender.com/api/weather?location=${state.location}${
            state.date ? `&date=${state.date}` : ''
          }${state.time ? `&time=${state.time}` : ''}`;
          
          const res = await fetch(url);
          const data = await res.json();
          setWeatherData(data);
        } catch (err) {
          console.error("Error fetching weather:", err);
        }
      };
      fetchWeather();
    }
  }, [weatherData, state]);

  // 🌤️ Weather visuals
  const weatherVisuals = {
     Clear: {
    image: "/images/clear.jpg",
    tagline: "A perfect day to shine bright ☀️",
  },
  'Clear Night': {
    image: "/images/clear_night.jpg",
    tagline: "Starry skies and peaceful nights ✨",
  },
  Clouds: {
    image: "/images/cloudy.jpg",
    tagline: "Under the soft dance of clouds ☁️",
  },
  'Clouds Night': {
    image: "/images/cloudy_night.jpg",
    tagline: "Night clouds painting the sky 🌙☁️",
  },
  Rain: {
    image: "/images/rainy.jpg",
    tagline: "Let the raindrops tell their story 🌧️",
  },
  'Rain Night': {
    image: "/images/rainy_night.jpg",
    tagline: "Rainy nights and cozy lights 🌧️✨",
  },
  Thunderstorm: {
    image: "/images/stormy.jpg",
    tagline: "A storm is on its way. Stay prepared 🌪️",
  },
  'Thunderstorm Night': {
    image: "/images/stormy_night.jpg",
    tagline: "Lightning dances across the night sky ⚡🌙",
  },
  Mist: {
    image: "/images/mist.jpg",
    tagline: "Calm skies and quiet winds 🌫️",
  },
  'Mist Night': {
    image: "/images/mist_night.jpg",
    tagline: "Mysterious nights under misty skies 🌙🌫️",
  },
  Fog: {
    image: "/images/mist.jpg",
    tagline: "Foggy horizons and soft whispers 🌁",
  },
  Haze: {
    image: "/images/mist.jpg",
    tagline: "Hazy views and gentle breezes 🌫️",
  },
  Smoke: {
    image: "/images/mist.jpg",
    tagline: "Smoky skies and warm glows 🌫️🔥",
  },
  Snow: {
    image: "/images/snowy.jpg",
    tagline: "Winter's gentle touch ❄️",
  },
  Drizzle: {
    image: "/images/rainy.jpg",
    tagline: "Soft drizzles and fresh air 🌦️",
  },
  Overcast: {
    image: "/images/cloudy.jpg",
    tagline: "Gray skies but bright spirits ☁️",
  },
  'Partly Cloudy': {
    image: "/images/cloudy.jpg",
    tagline: "Sun playing hide and seek with clouds ⛅",
  },
    Default: {
      image: "/images/clear.jpg",
      tagline: "Embrace the weather, whatever it brings 🌎",
    },
  };

  const rawCondition =
  displayWeather?.condition ||
  displayWeather?.main ||
  displayWeather?.weather?.[0]?.main ||
  displayWeather?.weather?.[0]?.description ||
  "Clear";

const normalized = rawCondition.toLowerCase();
const isNight = displayWeather?.time ? 
  (parseInt(displayWeather.time.split(':')[0]) >= 18 || parseInt(displayWeather.time.split(':')[0]) < 6) : 
  false;

let key = "Default";

// Check for night conditions first
if (isNight) {
  if (normalized.includes("clear")) key = "Clear Night";
  else if (normalized.includes("cloud")) key = "Clouds Night";
  else if (normalized.includes("rain")) key = "Rain Night";
  else if (normalized.includes("storm") || normalized.includes("thunder")) key = "Thunderstorm Night";
  else if (normalized.includes("mist") || normalized.includes("fog") || normalized.includes("haze") || normalized.includes("smoke")) 
    key = "Mist Night";
} else {
  // Daytime conditions
  if (normalized.includes("clear")) key = "Clear";
  else if (normalized.includes("cloud")) key = "Clouds";
  else if (normalized.includes("rain") || normalized.includes("drizzle")) key = "Rain";
  else if (normalized.includes("storm") || normalized.includes("thunder")) key = "Thunderstorm";
  else if (normalized.includes("mist") || normalized.includes("fog") || normalized.includes("haze") || normalized.includes("smoke")) 
    key = "Mist";
  else if (normalized.includes("snow")) key = "Snow";
  else if (normalized.includes("overcast")) key = "Overcast";
  else if (normalized.includes("partly")) key = "Partly Cloudy";
}

// If it's night but we have a specific condition that doesn't have a night version
if (isNight && !key.includes("Night") && !["Clear Night", "Clouds Night", "Rain Night", "Thunderstorm Night", "Mist Night"].includes(key)) {
  // Use default night for unsupported night conditions
  key = "Clear Night";
}

const { image, tagline } = weatherVisuals[key];
const condition = rawCondition;

  const profileName = user?.name || user?.given_name || "Guest User";
  const profileImage = user?.picture || "https://i.pravatar.cc/150?img=65";

  function getRightIcon(conditionKey) {
  const icons = {
    // Daytime icons
    Clear: MdWbSunny,
    Clouds: MdWbCloudy,
    Rain: MdCloudQueue,
    Thunderstorm: MdThunderstorm,
    Mist: MdGrain,
    Fog: MdGrain,
    Haze: MdGrain,
    Smoke: MdGrain,
    Snow: MdGrain,
    Drizzle: MdCloudQueue,
    Overcast: MdWbCloudy,
    'Partly Cloudy': MdWbCloudy,
    
    // Nighttime icons
    'Clear Night': MdWbSunny, // Consider using: <MdNightlightRound size={64} />
    'Clouds Night': MdWbCloudy,
    'Rain Night': MdCloudQueue,
    'Thunderstorm Night': MdThunderstorm,
    'Mist Night': MdGrain,
    
    Default: MdWbSunny,
  };

  return icons[conditionKey] || icons.Default;
}
  const handleLogout = () => {
    onLogout();
    navigate("/signin", { replace: true });
  };

  return (
    <div
      className="min-h-screen text-white relative transition-all duration-700 ease-in-out font-[Poppins]"
      style={{
        backgroundImage: `url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 px-6 pt-24 pb-6 md:px-10 md:pt-12 md:pb-10 flex flex-col min-h-screen">
        {/* Back Button */}
        <Link
          to="/checkforecast"
          className="absolute top-6 left-6 text-white/80 hover:text-white"
        >
          <MdArrowBack size={30} />
        </Link>

        {/* Profile + Logout */}
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-2 py-1 sm:px-3 shadow-lg">
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/40 object-cover"
          />

          <div className="hidden md:flex flex-col mr-2">
            <span className="text-sm font-semibold">{profileName}</span>
            <span className="text-xs text-white/70">Online</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-white/90 text-black hover:bg-white transition"
            aria-label="Logout"
          >
            <MdLogout size={20} />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">WeatherScope</h1>
          <p className="text-white/80 mt-2">
            Get detailed information for your event.
          </p>
          <p className="mt-3 text-lg font-medium">
            {weatherData?.location || "Loading..."}{" "}
            <span className="text-white/60">
              • {weatherData?.date || new Date().toLocaleDateString()} at{" "}
              {weatherData?.time || new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        </div>

        {/* 🌤️ Tagline (mobile view) */}
        <div className="md:hidden text-center mb-6">
          <h2 className="text-3xl font-extrabold drop-shadow-lg leading-snug">
            {tagline}
          </h2>
        </div>

        {/* Main Panels */}
        <div className="relative flex flex-col md:flex-row gap-4 flex-1 items-end max-w-7xl mx-auto w-full md:justify-center md:pt-16">
          {/* Tagline between rectangles */}
          <div className="hidden md:block absolute top-4 left-[30%] -translate-x-1/2 text-left max-w-xl px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg leading-snug">
              {tagline}
            </h2>
          </div>
          
          {/* Left Rectangle */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl flex flex-col justify-end w-full md:w-[55%] h-auto md:h-[55vh] min-h-[400px] md:min-h-0">
            <h3 className="text-white text-lg sm:text-xl font-normal mb-4 md:mb-6">
              Highlights
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/5">
                <Droplets size={24} className="sm:w-7 sm:h-7 mb-2" />
                <p className="text-2xl sm:text-3xl font-bold">
                  {weatherData?.humidity || "--"}%
                </p>
                <p className="text-xs sm:text-sm text-white/70">Humidity</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/5">
                <CloudRain size={24} className="sm:w-7 sm:h-7 mb-2" />
                <p className="text-2xl sm:text-3xl font-bold">
                  {weatherData?.precipitation ?? weatherData?.rain ?? 0}%
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                  Precipitation
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/5">
                <Wind size={24} className="sm:w-7 sm:h-7 mb-2" />
                <p className="text-2xl sm:text-3xl font-bold">
                  {weatherData?.windSpeed ?? weatherData?.wind ?? "--"} km/h
                </p>
                <p className="text-xs sm:text-sm text-white/70">Wind Speed</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/5">
                <Eye size={24} className="sm:w-7 sm:h-7 mb-2" />
                <p className="text-2xl sm:text-3xl font-bold">
                  {weatherData?.visibility || "--"} km
                </p>
                <p className="text-xs sm:text-sm text-white/70">Visibility</p>
              </div>
            </div>
          </div>

          {/* Right Rectangle */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 flex flex-col items-center w-full md:w-[40%] h-auto md:h-[80vh] min-h-[450px] md:min-h-0 shadow-2xl">
            {React.createElement(getRightIcon(key), {
              size: 64,
              className: "sm:w-20 sm:h-20 mb-2 text-yellow-200",
            })}

            <p className="text-4xl sm:text-5xl font-bold">
              {weatherData?.temperature || "--"}°C
            </p>
            <p className="text-base sm:text-lg text-white/80 mb-6">
              {condition}
            </p>

            {/* Map */}
            <div className="w-full h-32 sm:h-40 rounded-xl overflow-hidden mb-4 sm:mb-6">
              <iframe
                title="map"
                width="100%"
                height="100%"
                src={`https://maps.google.com/maps?q=${
                  weatherData?.location || "Delhi"
                }&z=10&output=embed`}
              ></iframe>
            </div>

            {/* Hourly forecast */}
            <div className="w-full bg-white/5 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-sm uppercase tracking-wide">
                  Hourly
                </p>
                <span className="text-white/60 text-xs">Next 6 hrs</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {(weatherData?.hourly || []).length ? (
                  weatherData.hourly.map((hour, index) => (
                    <div
                      key={`${hour.time}-${index}`}
                      className={`flex-shrink-0 min-w-[120px] bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm border ${
                        selectedHour?.time === hour.time 
                          ? "border-yellow-400 bg-white/20" 
                          : "border-white/10"
                      } cursor-pointer hover:bg-white/15 transition-all`}
                      onClick={() => setSelectedHour(hour)}
                    >
                      <p className="text-sm text-white/80">{hour.time}</p>
                      <div className="flex items-center justify-center my-2">
                        {hour.icon ? (
                          <img
                            src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                            alt={hour.condition}
                            className="w-12 h-12"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.classList.remove("hidden");
                            }}
                          />
                        ) : null}
                        <span
                          className={`${
                            hour.icon ? "hidden" : ""
                          } text-white/80`}
                        >
                          <MdCloudy size={28} />
                        </span>
                      </div>
                      <p className="text-xl font-semibold">{hour.temp}°C</p>
                      <p className="text-xs text-white/60">{hour.condition}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/70 text-sm">
                    Hourly forecast unavailable.
                  </p>
                )}
              </div>
              {selectedHour && (
                <div className="mt-2 text-center">
                  <button
                    onClick={() => setSelectedHour(null)}
                    className="text-sm text-white/70 hover:text-white underline"
                  >
                    Reset to main forecast
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Responsive styling */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
            @media (max-width: 768px) {
              .md\\:col-span-2 {
                grid-column: span 3 / span 3 !important;
              }
              .h-\\[70vh\\] {
                height: auto !important;
              }
              h2 {
                font-size: 1.8rem !important;
                text-align: center !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Dashboard;