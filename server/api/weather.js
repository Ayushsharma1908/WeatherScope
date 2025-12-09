import axios from "axios";

// --------------------
// Location temp adjustments
// --------------------
const getLocationClimateAdjustment = (locationName) => {
  const loc = locationName.toLowerCase();

  if (["shimla","manali","darjeeling","nainital","mussoorie"].some(x => loc.includes(x))) return -2;
  if (["mumbai","chennai","kolkata","goa","kochi"].some(x => loc.includes(x))) return 1;
  if (["jaisalmer","jodhpur","bikaner"].some(x => loc.includes(x))) return 2;

  return 0;
};

// --------------------
// Map Open-Meteo weathercode → Text
// --------------------
const getWeatherCondition = (code) => {
  const map = {
    0: "Clear",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Rain Showers",
    82: "Heavy Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm"
  };
  return map[code] || "Clear";
};

// --------------------
// Map condition → icon
// --------------------
const getWeatherIcon = (condition) => {
  const c = condition.toLowerCase();
  if (c.includes("night")) {
    if (c.includes("clear")) return "01n";
    if (c.includes("cloud")) return "02n";
    return "02n";
  }
  if (c.includes("clear")) return "01d";
  if (c.includes("cloud")) return "02d";
  if (c.includes("overcast")) return "03d";
  if (c.includes("rain")) return "10d";
  if (c.includes("snow")) return "13d";
  if (c.includes("thunder")) return "11d";
  if (c.includes("fog")) return "50d";
  return "01d";
};

// --------------------
// Main API
// --------------------
export const getWeatherData = async (req, res) => {
  try {
    const { location, date, time } = req.query;
    if (!location) return res.status(400).json({ error: "Location required" });

    // 1️⃣ Geocode location
    const geoRes = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
      params: { name: location, count: 1 }
    });
    if (!geoRes.data.results?.length) return res.status(404).json({ error: "Location not found" });

    const place = geoRes.data.results[0];
    const lat = place.latitude;
    const lon = place.longitude;
    const cityName = place.name;

    const today = new Date();
    const requestedDate = date || today.toISOString().split("T")[0];
    const requestedHour = time ? parseInt(time.split(":")[0]) : today.getHours();
    const locationAdjustment = getLocationClimateAdjustment(cityName);

    // 2️⃣ Fetch weather + UV index
    const weatherRes = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        timezone: "auto",
        current_weather: true,
        hourly: "temperature_2m,weathercode,precipitation_probability,uv_index",
        forecast_days: 7
      }
    });

    const current = weatherRes.data.current_weather;
    const hourly = weatherRes.data.hourly;

    // ---- FIXED UV INDEX ----
    const uvArray = hourly.uv_index || [];
    let currentUV = uvArray[requestedHour];

    // If it's null (night), pick next non-null UV value
    if (currentUV === null || currentUV === undefined) {
      currentUV = uvArray.find(v => v !== null) || 0;
    }

    currentUV = Math.round(currentUV);

    // 3️⃣ Current temp
    let finalTemp = Math.round(current.temperature + locationAdjustment);

    // 4️⃣ Condition
    let condition = getWeatherCondition(current.weathercode);
    const isNight = requestedHour >= 18 || requestedHour < 6;
    if (isNight && condition.includes("Clear")) condition = "Clear Night";

    // 5️⃣ Hourly forecast (next 6 hours)
    const hourlyForecast = [];
    for (let i = 0; i < 6; i++) {
      const hour = (requestedHour + i) % 24;
      const dateTime = `${requestedDate}T${hour.toString().padStart(2, "0")}:00`;
      const idx = hourly.time.indexOf(dateTime);

      let hrTemp = finalTemp;
      let hrCond = condition;

      if (idx !== -1) {
        hrTemp = Math.round(hourly.temperature_2m[idx] + locationAdjustment);
        hrCond = getWeatherCondition(hourly.weathercode[idx]);
        if (hour >= 18 || hour < 6 && hrCond.includes("Clear")) hrCond = "Clear Night";
      }

      hourlyForecast.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        temp: hrTemp,
        condition: hrCond,
        icon: getWeatherIcon(hrCond)
      });
    }

    // 6️⃣ Send response
    res.json({
      location: cityName,
      temperature: finalTemp,
      condition,
      uv_index: currentUV,
      precipitation: 0,
      windSpeed: Math.round(current.windspeed * 3.6),
      visibility: 10,
      date: requestedDate,
      time: `${requestedHour.toString().padStart(2, "0")}:00`,
      hourly: hourlyForecast,
      main: condition,
      weather: [{ main: condition, description: condition.toLowerCase() }],
      wind: Math.round(current.windspeed * 3.6)
    });

  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: "Unable to fetch weather. Please try again later." });
  }
};
