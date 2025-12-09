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
import { Wind, Eye, CloudRain, SunDim } from "lucide-react";

const Dashboard = ({ onLogout, user }) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [weatherData, setWeatherData] = useState(state?.weatherData || null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(state?.weatherData?.location || "");

  const displayWeather = selectedHour || weatherData;

  // ===========================
  // ✅ FETCH LATEST WEATHER
  // ===========================
  const fetchWeather = async () => {
    if (!search) {
      alert("Please enter a location!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://weatherscope-gw2z.onrender.com/api/weather?location=${search}`
      );

      if (!response.ok) throw new Error("Network response error");

      const data = await response.json();
      console.log("Fetched Weather:", data);

      setWeatherData(data);
      setSelectedHour(null);
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Unable to fetch weather. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // WEATHER VISUALS
  // ===========================
  const weatherVisuals = {
    Clear: { image: "/images/clear.jpg", tagline: "A perfect day to shine bright ☀️" },
    "Clear Night": { image: "/images/clear_night.jpg", tagline: "Starry skies tonight ✨" },
    Clouds: { image: "/images/cloudy.jpg", tagline: "Soft clouds drifting ☁️" },
    "Clouds Night": { image: "/images/cloudy_night.jpg", tagline: "Cloudy night sky 🌙" },
    Rain: { image: "/images/rainy.jpg", tagline: "Raindrops falling gently 🌧️" },
    "Rain Night": { image: "/images/rainy_night.jpg", tagline: "Rainy night ambience 🌧️✨" },
    Thunderstorm: { image: "/images/stormy.jpg", tagline: "Thunder roars ahead ⚡" },
    "Thunderstorm Night": { image: "/images/stormy_night.jpg", tagline: "Stormy night ⚡🌙" },
    Mist: { image: "/images/mist.jpg", tagline: "Silent mist flows 🌫️" },
    "Mist Night": { image: "/images/mist_night.jpg", tagline: "Misty night whispers 🌙🌫️" },
    Fog: { image: "/images/mist.jpg", tagline: "Fog descends softly 🌫️" },
    Haze: { image: "/images/mist.jpg", tagline: "Hazy skies around 🌫️" },
    Smoke: { image: "/images/mist.jpg", tagline: "Smoky atmosphere around 🔥" },
    Snow: { image: "/images/snowy.jpg", tagline: "Snowy and calm ❄️" },
    Drizzle: { image: "/images/rainy.jpg", tagline: "Soft drizzle today 🌦️" },
    Overcast: { image: "/images/cloudy.jpg", tagline: "Grey skies above ☁️" },
    "Partly Cloudy": { image: "/images/cloudy.jpg", tagline: "Clouds hiding the sun ⛅" },
    Default: { image: "/images/clear.jpg", tagline: "WeatherScope keeps you prepared 🌍" },
  };

  const rawCondition =
    displayWeather?.condition ||
    displayWeather?.main ||
    displayWeather?.weather?.[0]?.main ||
    displayWeather?.weather?.[0]?.description ||
    "Clear";

  const normalized = rawCondition.toLowerCase();
  const isNight =
    displayWeather?.time
      ? +displayWeather.time.split(":")[0] >= 18 || +displayWeather.time.split(":")[0] < 6
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
    else if (normalized.includes("rain") || normalized.includes("drizzle")) key = "Rain";
    else if (normalized.includes("storm")) key = "Thunderstorm";
    else if (normalized.includes("snow")) key = "Snow";
    else if (normalized.includes("mist") || normalized.includes("fog")) key = "Mist";
  }

  const { image, tagline } = weatherVisuals[key];

  const profileName = user?.name || user?.given_name || "Guest User";
  const profileImage = user?.picture || "https://i.pravatar.cc/150?img=65";

  // ICON MAPPER
  const getRightIcon = (c) => {
    const map = {
      Clear: MdWbSunny,
      Clouds: MdWbCloudy,
      Rain: MdCloudQueue,
      Thunderstorm: MdThunderstorm,
      Mist: MdGrain,
      Snow: MdGrain,
      Default: MdWbSunny,
    };
    return map[c] || map.Default;
  };

  return (
    <div
      className="min-h-screen text-white relative font-[Poppins]"
      style={{
        backgroundImage: `url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-6 pt-24 pb-6 md:px-10 flex flex-col min-h-screen">
        {/* Back Button */}
        <Link to="/checkforecast" className="absolute top-6 left-6 text-white/80">
          <MdArrowBack size={30} />
        </Link>

        {/* Profile */}
        <div className="absolute top-4 right-4 bg-white/10 border border-white/20 rounded-full px-3 py-1 flex items-center gap-3">
          <img
            src={profileImage}
            className="w-10 h-10 rounded-full border border-white/30"
          />
          <span className="hidden md:block text-sm">{profileName}</span>
          <button
            onClick={() => {
              onLogout();
              navigate("/signin");
            }}
            className="p-2 bg-white text-black rounded-full"
          >
            <MdLogout size={18} />
          </button>
        </div>

        {/* Search Box */}
        <div className="text-center mt-4 mb-6">
          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white border border-white/30 w-64"
          />
          <button
            onClick={fetchWeather}
            className="ml-3 px-4 py-2 bg-yellow-500 text-black rounded-xl"
          >
            Search
          </button>
        </div>

        {/* Weather Info */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold">WeatherScope</h1>
          <p className="text-white/80 mt-2">{tagline}</p>
        </div>

        {/* MAIN CONTAINER */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          {/* LEFT PANEL */}
          <div className="bg-white/10 p-6 rounded-2xl w-full md:w-1/2 border border-white/20">
            <h3 className="text-xl mb-4">Highlights</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl text-center">
                <SunDim size={30} />
                <p className="text-3xl font-bold">{weatherData?.uv_index ?? "N/A"}</p>
                <p className="text-sm text-white/70">UV Index</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <CloudRain size={30} />
                <p className="text-3xl font-bold">
                  {weatherData?.precipitation ?? weatherData?.rain ?? 0}%
                </p>
                <p className="text-sm text-white/70">Precipitation</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <Wind size={30} />
                <p className="text-3xl font-bold">
                  {weatherData?.windSpeed ?? weatherData?.wind ?? "--"} km/h
                </p>
                <p className="text-sm text-white/70">Wind</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <Eye size={30} />
                <p className="text-3xl font-bold">{weatherData?.visibility ?? "--"} km</p>
                <p className="text-sm text-white/70">Visibility</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white/10 p-6 rounded-2xl w-full md:w-1/2 border border-white/20 text-center">
            {React.createElement(getRightIcon(key), {
              size: 60,
              className: "mb-3 text-yellow-300",
            })}

            <p className="text-5xl font-bold">{weatherData?.temperature ?? "--"}°C</p>
            <p className="text-lg text-white/70 mt-2">{rawCondition}</p>

            {/* MAP */}
            <div className="mt-4 rounded-xl overflow-hidden h-40">
              <iframe
                title="map"
                width="100%"
                height="100%"
                src={`https://maps.google.com/maps?q=${
                  weatherData?.location || search
                }&z=10&output=embed`}
              ></iframe>
            </div>

            {/* HOURLY FORECAST */}
            <div className="mt-5">
              <h4 className="text-white/80 mb-2">Next 6 Hours</h4>
              <div className="flex gap-3 overflow-x-scroll pb-2">
                {(weatherData?.hourly || []).map((hour, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedHour(hour)}
                    className={`min-w-[120px] bg-white/10 p-3 rounded-xl border ${
                      selectedHour?.time === hour.time
                        ? "border-yellow-400 bg-white/20"
                        : "border-white/20"
                    } cursor-pointer`}
                  >
                    <p className="text-sm">{hour.time}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                      className="w-12 mx-auto"
                    />
                    <p className="text-xl font-bold">{hour.temp}°C</p>
                    <p className="text-xs text-white/60">{hour.condition}</p>
                  </div>
                ))}
              </div>

              {selectedHour && (
                <button
                  onClick={() => setSelectedHour(null)}
                  className="mt-3 text-sm underline"
                >
                  Reset to main forecast
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
