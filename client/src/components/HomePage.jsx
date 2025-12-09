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
} from "react-icons/md";
import { Droplets, Wind, Eye, CloudRain } from "lucide-react";

const WEATHER_VISUALS = {
Clear: { image: "/images/clear.jpg", tagline: "A perfect day to shine bright ☀️" },
Clouds: { image: "/images/cloudy.jpg", tagline: "Under the soft dance of clouds ☁️" },
Rain: { image: "/images/rainy.jpg", tagline: "Let the raindrops tell their story 🌧️" },
Thunderstorm: { image: "/images/stormy.jpg", tagline: "A storm is on its way. Stay prepared 🌪️" },
Mist: { image: "/images/mist.jpg", tagline: "Calm skies and quiet winds 🌙" },
Default: { image: "/images/clear.jpg", tagline: "Embrace the weather, whatever it brings 🌎" },
};

const getRightIcon = (condition = "") => {
const c = condition.toLowerCase();
if (c.includes("clear") || c.includes("sun")) return MdWbSunny;
if (c.includes("cloud")) return MdWbCloudy;
if (c.includes("rain")) return MdGrain;
if (c.includes("storm") || c.includes("thunder")) return MdThunderstorm;
if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return MdCloudQueue;
return MdWbCloudy;
};

const HomePage = ({ onLogout, user }) => {
const { state } = useLocation();
const navigate = useNavigate();
const [weatherData, setWeatherData] = useState(state?.weatherData || null);
const [selectedHour, setSelectedHour] = useState(null);

useEffect(() => {
if (!weatherData && state?.location) {
const fetchWeather = async () => {
try {
const res = await fetch(`http://localhost:5000/api/weather?location=${state.location}`);
const data = await res.json();
setWeatherData(data);
} catch (err) {
console.error("Error fetching weather:", err);
}
};
fetchWeather();
}
}, [weatherData, state]);

const displayWeather = selectedHour || weatherData;
const getDisplayDateTime = (weather) => {
if (!weather?.dt) return { date: "Loading...", time: "--:--" };
const dt = new Date(weather.dt * 1000);
return {
date: dt.toLocaleDateString(),
time: dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};
};
const { date, time } = getDisplayDateTime(displayWeather);

const dt = displayWeather?.dt || Math.floor(Date.now() / 1000);
const sunrise = displayWeather?.sunrise || dt - 3600;
const sunset = displayWeather?.sunset || dt + 3600;
const isNight = dt < sunrise || dt >= sunset;

const rawCondition = displayWeather?.condition || "Default";
const normalized = rawCondition.toLowerCase();
let key = "Default";
if (normalized.includes("clear")) key = "Clear";
else if (normalized.includes("cloud")) key = "Clouds";
else if (normalized.includes("rain")) key = "Rain";
else if (normalized.includes("storm") || normalized.includes("thunder")) key = "Thunderstorm";
else if (["mist", "fog", "haze", "smoke"].some((x) => normalized.includes(x))) key = "Mist";

const { image: dayImage, tagline } = WEATHER_VISUALS[key];
const image =
isNight && key !== "Mist"
? key === "Clear"
? "/images/clear_night.jpg"
: key === "Clouds"
? "/images/cloudy_night.jpg"
: key === "Rain"
? "/images/rainy_night.jpg"
: key === "Thunderstorm"
? "/images/stormy_night.jpg"
: dayImage
: dayImage;

const temperature = displayWeather?.temperature || displayWeather?.temp || "--";

const profileName = user?.name || user?.given_name || user?.displayName || "Guest User";
let profileImage = user?.picture?.replace("=s96-c", "=s512-c") || "[https://i.pravatar.cc/150?img=65](https://i.pravatar.cc/150?img=65)";
const handleLogout = () => {
onLogout();
navigate("/signin", { replace: true });
};

return (
<div
className="min-h-screen text-white relative transition-all duration-700 ease-in-out font-[Poppins]"
style={{ backgroundImage: `url('${image}')`, backgroundSize: "cover", backgroundPosition: "center" }}
> <div className="absolute inset-0 bg-black/50"></div> <div className="relative z-10 px-6 pt-24 pb-6 md:px-10 md:pt-12 md:pb-10 flex flex-col min-h-screen"> <Link to="/checkforecast" className="absolute top-6 left-6 text-white/80 hover:text-white"> <MdArrowBack size={30} /> </Link><button 
  onClick={() => navigate(-1)} 
  className="absolute top-6 left-6 text-white/80 hover:text-white"
>
  <MdArrowBack size={30} />
</button>
    <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-2 py-1 sm:px-3 shadow-lg">
      <img
        src={profileImage}
        alt="Profile"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/40 object-cover"
        onError={(e) => (e.target.src = "/fallback.png")}
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

    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold">WeatherScope</h1>
      <p className="text-white/80 mt-2">Get detailed information for your event.</p>
      <p className="mt-3 text-lg font-medium">
        {displayWeather?.location || "Loading..."} <span className="text-white/60">• {date} at {time}</span>
      </p>
    </div>

    <div className="md:hidden text-center mb-6">
      <h2 className="text-3xl font-extrabold drop-shadow-lg leading-snug">{tagline}</h2>
    </div>

    <div className="relative flex flex-col md:flex-row gap-4 flex-1 items-end max-w-7xl mx-auto w-full md:justify-center md:pt-16">
      <div className="hidden md:block absolute top-4 left-[30%] -translate-x-1/2 text-left max-w-xl px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg leading-snug">{tagline}</h2>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-[#e0e0e0] shadow-2xl flex flex-col justify-end w-full md:w-[55%] h-auto md:h-[55vh] min-h-[400px] md:min-h-0">
        <h3 className="text-white text-lg sm:text-xl font-normal mb-4 md:mb-6">Highlights</h3>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <HighlightCard icon={Droplets} label="Humidity" value={displayWeather?.humidity || "--"} unit="%" />
          <HighlightCard icon={CloudRain} label="Precipitation" value={displayWeather?.precipitation ?? displayWeather?.rain ?? 0} unit="%" />
          <HighlightCard icon={Wind} label="Wind Speed" value={displayWeather?.windSpeed ?? displayWeather?.wind ?? "--"} unit="km/h" />
          <HighlightCard icon={Eye} label="Visibility" value={displayWeather?.visibility || "--"} />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-[#e0e0e0] flex flex-col items-center w-full md:w-[40%] h-auto md:h-[80vh] min-h-[450px] md:min-h-0 shadow-2xl">
        {React.createElement(getRightIcon(rawCondition), { size: 64, className: "sm:w-20 sm:h-20 mb-2 text-yellow-200" })}
        <p className="text-4xl sm:text-5xl font-bold">{temperature}°C</p>
        <p className="text-base sm:text-lg text-white/80 mb-6">{rawCondition}</p>

        <div className="w-full h-32 sm:h-40 rounded-xl overflow-hidden mb-4 sm:mb-6">
          <iframe
            title="map"
            width="100%"
            height="100%"
            src={`https://maps.google.com/maps?q=${displayWeather?.location || "Delhi"}&z=10&output=embed`}
          />
        </div>

        <HourlyForecast
          hourly={weatherData?.hourly || []}
          selectedHour={selectedHour}
          onSelect={setSelectedHour}
        />
      </div>
    </div>
  </div>
</div>


);
};

const HighlightCard = ({ icon: Icon, label, value, unit = "" }) => (

  <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/5 border border-[#e0e0e0]">
    <Icon size={24} className="sm:w-7 sm:h-7 mb-2" />
    <p className="text-2xl sm:text-3xl font-bold">{value}{unit}</p>
    <p className="text-xs sm:text-sm text-white/70">{label}</p>
  </div>
);

const HourlyForecast = ({ hourly, selectedHour, onSelect }) => (

  <div className="w-full bg-white/5 rounded-xl p-4 flex flex-col gap-3 border border-[#e0e0e0]">
    <div className="flex items-center justify-between">
      <p className="text-white/80 text-sm uppercase tracking-wide">Hourly</p>
      <span className="text-white/60 text-xs">Next 6 hrs</span>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-1">
      {hourly.length ? (
        hourly.map((hour, index) => (
          <div
            key={`${hour.time}-${index}`}
            className={`flex-shrink-0 min-w-[120px] cursor-pointer bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm border ${
              selectedHour?.time === hour.time ? "border-yellow-400" : "border-white/10"
            }`}
            onClick={() => onSelect(hour)}
          >
            <p className="text-sm text-white/80">{hour.time}</p>
            <div className="flex items-center justify-center my-2">
              {hour.icon ? (
                <img
                  src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                  alt={hour.condition}
                  className="w-12 h-12"
                />
              ) : (
                <MdWbCloudy size={28} className="text-white/80" />
              )}
            </div>
            <p className="text-xl font-semibold">{hour.temp}°C</p>
            <p className="text-xs text-white/60">{hour.condition}</p>
          </div>
        ))
      ) : (
        <p className="text-white/70 text-sm">Hourly forecast unavailable.</p>
      )}
    </div>
  </div>
);

export default HomePage;
