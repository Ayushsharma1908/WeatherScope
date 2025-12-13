import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdWbSunny,
  MdWbCloudy,
  MdCloudQueue,
  MdGrain,
  MdThunderstorm,
  MdArrowBack,
  MdLogout,
} from "react-icons/md";
import { Wind, Eye, CloudRain, SunDim } from "lucide-react";

// ===========================
// CONSTANTS
// ===========================
const weatherVisuals = {
  Clear: {
    image: "/images/clear.jpg",
    tagline: "A perfect day to shine bright ☀️",
  },
  "Clear Night": {
    image: "/images/clear_night.jpg",
    tagline: "Starry skies tonight ✨",
  },
  Clouds: { image: "/images/cloudy.jpg", tagline: "Soft clouds drifting ☁️" },
  "Clouds Night": {
    image: "/images/cloudy_night.jpg",
    tagline: "Cloudy night sky 🌙",
  },
  Rain: { image: "/images/rainy.jpg", tagline: "Raindrops falling gently 🌧️" },
  "Rain Night": {
    image: "/images/rainy_night.jpg",
    tagline: "Rainy night ambience 🌧️✨",
  },
  Thunderstorm: {
    image: "/images/stormy.jpg",
    tagline: "Thunder roars ahead ⚡",
  },
  "Thunderstorm Night": {
    image: "/images/stormy_night.jpg",
    tagline: "Stormy night ⚡🌙",
  },
  Mist: { image: "/images/mist.jpg", tagline: "Silent mist flows 🌫️" },
  "Mist Night": {
    image: "/images/mist_night.jpg",
    tagline: "Misty night whispers 🌙🌫️",
  },
  Fog: { image: "/images/mist.jpg", tagline: "Fog descends softly 🌫️" },
  Haze: { image: "/images/mist.jpg", tagline: "Hazy skies around 🌫️" },
  Smoke: { image: "/images/mist.jpg", tagline: "Smoky atmosphere around 🔥" },
  Snow: { image: "/images/snowy.jpg", tagline: "Snowy and calm ❄️" },
  Drizzle: { image: "/images/rainy.jpg", tagline: "Soft drizzle today 🌦️" },
  Overcast: { image: "/images/cloudy.jpg", tagline: "Grey skies above ☁️" },
  "Partly Cloudy": {
    image: "/images/cloudy.jpg",
    tagline: "Clouds hiding the sun ⛅",
  },
  Default: {
    image: "/images/clear.jpg",
    tagline: "WeatherScope keeps you prepared 🌍",
  },
};

const getRightIcon = (condition = "") => {
  const normalized = condition.toLowerCase();

  if (normalized.includes("clear")) return MdWbSunny;
  if (normalized.includes("cloud") || normalized.includes("overcast"))
    return MdWbCloudy;
  if (normalized.includes("rain") || normalized.includes("drizzle"))
    return MdCloudQueue;
  if (normalized.includes("storm") || normalized.includes("thunder"))
    return MdThunderstorm;
  if (
    normalized.includes("mist") ||
    normalized.includes("fog") ||
    normalized.includes("haze") ||
    normalized.includes("smoke")
  )
    return MdGrain;
  if (normalized.includes("snow")) return MdGrain;

  return MdWbSunny;
};

// ===========================
// COMPONENTS
// ===========================
const ProfileHeader = ({ user, onLogout }) => {
  const profileName = user?.name || user?.given_name || "Guest User";
  const profileImage = user?.picture || "https://i.pravatar.cc/150?img=65";

  return (
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
        onClick={onLogout}
        className="p-2 rounded-full bg-white/90 text-black hover:bg-white transition"
        aria-label="Logout"
      >
        <MdLogout size={20} />
      </button>
    </div>
  );
};

const HighlightsPanel = ({ weatherData }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl flex flex-col justify-end w-full md:w-[55%] h-auto md:h-[55vh] min-h-[400px] md:min-h-0">
    <h3 className="text-white text-lg sm:text-xl font-normal mb-4 md:mb-6">
      Highlights
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
      <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/5">
        <SunDim size={24} className="sm:w-7 sm:h-7 mb-2" />
        <p className="text-2xl sm:text-3xl font-bold">
          {weatherData?.uv_index ?? "N/A"}
        </p>
        <p className="text-xs sm:text-sm text-white/70">UV Index</p>
      </div>
      <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/5">
        <CloudRain size={24} className="sm:w-7 sm:h-7 mb-2" />
        <p className="text-2xl sm:text-3xl font-bold">
          {weatherData?.precipitation ?? weatherData?.rain ?? 0}%
        </p>
        <p className="text-xs sm:text-sm text-white/70">Precipitation</p>
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
);

const HourlyForecastCard = ({ hour, selectedHour, setSelectedHour }) => (
  <div
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
      <span className={`${hour.icon ? "hidden" : ""} text-white/80`}>
        <MdWbCloudy size={28} />
      </span>
    </div>
    <p className="text-xl font-semibold">{hour.temp}°C</p>
    <p className="text-xs text-white/60">{hour.condition}</p>
  </div>
);

const MainWeatherPanel = ({
  weatherData,
  keyCondition,
  tagline,
  selectedHour,
  setSelectedHour,
}) => {
  const IconComponent = getRightIcon(keyCondition);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 flex flex-col items-center w-full md:w-[40%] h-auto md:h-[80vh] min-h-[450px] md:min-h-0 shadow-2xl">
      <IconComponent
        size={64}
        className="sm:w-20 sm:h-20 mb-2 text-yellow-200"
      />
      <p className="text-4xl sm:text-5xl font-bold">
        {weatherData?.temperature || "--"}°C
      </p>
      <p className="text-base sm:text-lg text-white/80 mb-6">
        {weatherData?.condition || "N/A"}
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

      {/* Hourly Forecast */}
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
              <HourlyForecastCard
                key={`${hour.time}-${index}`}
                hour={hour}
                selectedHour={selectedHour}
                setSelectedHour={setSelectedHour}
              />
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
  );
};

// ===========================
// MAIN DASHBOARD
// ===========================
const Dashboard = ({ onLogout, user }) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [weatherData, setWeatherData] = useState(state?.weatherData || null);
  const [selectedHour, setSelectedHour] = useState(null);

  const displayWeather = selectedHour || weatherData;

  // Determine weather visuals
  const rawCondition =
    displayWeather?.condition ||
    displayWeather?.main ||
    displayWeather?.weather?.[0]?.main ||
    displayWeather?.weather?.[0]?.description ||
    "Clear";

  const normalized = rawCondition.toLowerCase();
  const isNight = displayWeather?.time
    ? +displayWeather.time.split(":")[0] >= 18 ||
      +displayWeather.time.split(":")[0] < 6
    : false;

  let key = "Default";

  if (isNight) {
    if (normalized.includes("clear")) key = "Clear Night";
    else if (normalized.includes("cloud")) key = "Clouds Night";
    else if (normalized.includes("rain")) key = "Rain Night";
    else if (normalized.includes("storm")) key = "Thunderstorm Night";
    else key = "Mist Night";
  } else {
    if (normalized.includes("clear")) key = "Clear";
    else if (normalized.includes("cloud")) key = "Clouds";
    else if (normalized.includes("rain") || normalized.includes("drizzle"))
      key = "Rain";
    else if (normalized.includes("storm")) key = "Thunderstorm";
    else if (normalized.includes("snow")) key = "Snow";
    else if (normalized.includes("mist") || normalized.includes("fog"))
      key = "Mist";
  }

  const { image, tagline } = weatherVisuals[key];

  const handleLogout = () => {
    onLogout?.();
    navigate("/signin");
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

        {/* Profile Header */}
        <ProfileHeader user={user} onLogout={handleLogout} />

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
              {weatherData?.time ||
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </p>
        </div>

        {/* Tagline (mobile) */}
        <div className="md:hidden text-center mb-6">
          <h2 className="text-3xl font-extrabold drop-shadow-lg leading-snug">
            {tagline}
          </h2>
        </div>

        {/* Main Panels */}
        <div className="relative flex flex-col md:flex-row gap-4 flex-1 items-end max-w-7xl mx-auto w-full md:justify-center md:pt-16">
          {/* Tagline (desktop) */}
          <div className="hidden md:block absolute top-4 left-[30%] -translate-x-1/2 text-left max-w-xl px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg leading-snug">
              {tagline}
            </h2>
          </div>

          {/* Left Rectangle */}
          <HighlightsPanel weatherData={weatherData} />

          {/* Right Rectangle */}
          <MainWeatherPanel
            weatherData={weatherData}
            keyCondition={rawCondition}
            tagline={tagline}
            selectedHour={selectedHour}
            setSelectedHour={setSelectedHour}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
