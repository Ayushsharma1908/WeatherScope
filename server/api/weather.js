// backend/api/weather.js
import axios from "axios";

// -----------------------------------------------
// SMALL LOCATION-BASED CLIMATE ADJUSTMENTS
// -----------------------------------------------
const getLocationClimateAdjustment = (locationName) => {
  const loc = locationName.toLowerCase();

  if (
    loc.includes("shimla") ||
    loc.includes("manali") ||
    loc.includes("darjeeling") ||
    loc.includes("nainital") ||
    loc.includes("mussoorie")
  ) return -2;

  if (
    loc.includes("mumbai") ||
    loc.includes("chennai") ||
    loc.includes("kolkata") ||
    loc.includes("goa") ||
    loc.includes("kochi")
  ) return 1;

  if (
    loc.includes("jaisalmer") ||
    loc.includes("jodhpur") ||
    loc.includes("bikaner")
  ) return 2;

  return 0;
};

// -----------------------------------------------
// WEATHER CODE → TEXT CONDITION
// -----------------------------------------------
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

// -----------------------------------------------
// WEATHER CONDITION → ICON
// -----------------------------------------------
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

// -----------------------------------------------
// SEASON
// -----------------------------------------------
const getSeason = (month) => {
  if (month >= 11 || month <= 1) return "Winter";
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  return "Fall";
};

// -----------------------------------------------
// MAIN API
// -----------------------------------------------
export const getWeatherData = async (req, res) => {
  try {
    const { location, date, time } = req.query;
    if (!location) return res.status(400).json({ error: "Location required" });

    console.log("🌍 Weather Request:", { location, date, time });

    // ------------------------------------------
    // STEP 1 — USE OPEN-METEO GEOCODING (Stable)
    // ------------------------------------------
    const geoRes = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      { params: { name: location, count: 1 } }
    );

    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    const place = geoRes.data.results[0];
    const lat = place.latitude;
    const lon = place.longitude;
    const cityName = place.name;

    // ------------------------------------------
    // STEP 2 — Date / Time
    // ------------------------------------------
    const today = new Date();
    const requestedDate = date || today.toISOString().split("T")[0];
    const requestedHour = time ? parseInt(time.split(":")[0]) : today.getHours();
    const month = new Date(requestedDate).getMonth();

    const locationAdjustment = getLocationClimateAdjustment(cityName);

    // ------------------------------------------
    // STEP 3 — FETCH WEATHER FROM OPEN-METEO
    // ------------------------------------------
    const weatherRes = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        timezone: "auto",
        current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation",
        hourly: "temperature_2m,weather_code,precipitation_probability",
        forecast_days: 7
      }
    });

    const { current, hourly } = weatherRes.data;

    // ------------------------------------------
    // STEP 4 — Current temperature (ACTUAL)
    // ------------------------------------------
    let actualTemp = current.temperature_2m;
    let finalTemp = Math.round(actualTemp + locationAdjustment);

    // ------------------------------------------
    // STEP 5 — If Specific Time → Use Hourly Data
    // ------------------------------------------
    if (time) {
      const match = hourly.time.findIndex(
        (t) => t === `${requestedDate}T${requestedHour.toString().padStart(2, "0")}:00`
      );

      if (match !== -1) {
        finalTemp = Math.round(hourly.temperature_2m[match] + locationAdjustment);
      }
    }

    // ------------------------------------------
    // STEP 6 — Weather Condition (ACTUAL)
    // ------------------------------------------
    let condition = getWeatherCondition(current.weather_code);

    const isNight = requestedHour >= 18 || requestedHour < 6;
    if (isNight) {
      if (condition.includes("Clear")) condition = "Clear Night";
      else if (condition.includes("Cloud")) condition = "Partly Cloudy Night";
    }

    // ------------------------------------------
    // STEP 7 — HOURLY FORECAST (6 HOURS)
    // ------------------------------------------
    const hourlyForecast = [];
    const allTimes = hourly.time;

    for (let i = 0; i < 6; i++) {
      const hour = (requestedHour + i) % 24;
      const dateTime = `${requestedDate}T${hour.toString().padStart(2, "0")}:00`;
      const idx = allTimes.indexOf(dateTime);

      let hrTemp = finalTemp;
      let hrCond = condition;

      if (idx !== -1) {
        hrTemp = Math.round(hourly.temperature_2m[idx] + locationAdjustment);
        hrCond = getWeatherCondition(hourly.weather_code[idx]);
        if (hour >= 18 || hour < 6) {
          if (hrCond.includes("Clear")) hrCond = "Clear Night";
          else if (hrCond.includes("Cloud")) hrCond = "Partly Cloudy Night";
        }
      }

      hourlyForecast.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        temp: hrTemp,
        condition: hrCond,
        icon: getWeatherIcon(hrCond)
      });
    }

    // ------------------------------------------
    // STEP 8 — FINAL RESPONSE
    // ------------------------------------------
    const response = {
      location: cityName,
      temperature: finalTemp,
      condition,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation || 0,
      windSpeed: Math.round(current.wind_speed_10m * 3.6), // m/s → km/h
      visibility: 10,
      date: requestedDate,
      time: `${requestedHour.toString().padStart(2, "0")}:00`,
      hourly: hourlyForecast,
      main: condition,
      weather: [{ main: condition, description: condition.toLowerCase() }],
      wind: Math.round(current.wind_speed_10m * 3.6),
      dt: Math.floor(Date.now() / 1000),
      debug: {
        apiTemp: actualTemp,
        adjustment: locationAdjustment,
        season: getSeason(month),
        source: "Open-Meteo"
      }
    };

    console.log("✅ Weather sent:", response.location, response.temperature + "°C");
    res.json(response);

  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: "Weather API failed" });
  }
};
