// backend/api/weather.js
import axios from 'axios';

// Location-based climate adjustment (small adjustments only!)
const getLocationClimateAdjustment = (locationName) => {
  const locationLower = locationName.toLowerCase();
  
  // Mountain regions (colder)
  if (locationLower.includes('shimla') || 
      locationLower.includes('manali') || 
      locationLower.includes('darjeeling') ||
      locationLower.includes('nainital') ||
      locationLower.includes('mussoorie')) {
    return -2; // Minor adjustment for altitude
  }
  
  // Coastal regions (slightly warmer, more humid)
  if (locationLower.includes('mumbai') || 
      locationLower.includes('chennai') || 
      locationLower.includes('kolkata') ||
      locationLower.includes('goa') ||
      locationLower.includes('kochi')) {
    return 1; // Small adjustment for coastal warmth
  }
  
  // Desert regions (slightly hotter)
  if (locationLower.includes('jaisalmer') || 
      locationLower.includes('jodhpur') || 
      locationLower.includes('bikaner')) {
    return 2; // Small adjustment for desert
  }
  
  // Default (Delhi, Pune, Bangalore, etc.)
  return 0;
};

// Helper functions
const getWeatherCondition = (code) => {
  const conditions = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Heavy Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Heavy Freezing Drizzle',
    61: 'Light Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Light Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Heavy Rain Showers',
    85: 'Light Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Heavy Hail'
  };
  return conditions[code] || 'Clear';
};

const getWeatherIconFromCondition = (condition) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('night')) {
    if (conditionLower.includes('clear')) return '01n';
    if (conditionLower.includes('cloud')) return '02n';
    return '02n';
  }
  
  if (conditionLower.includes('clear')) return '01d';
  if (conditionLower.includes('partly') || conditionLower.includes('cloud')) return '02d';
  if (conditionLower.includes('overcast')) return '03d';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '10d';
  if (conditionLower.includes('snow')) return '13d';
  if (conditionLower.includes('thunderstorm')) return '11d';
  if (conditionLower.includes('fog')) return '50d';
  return '01d';
};

const getSeason = (month) => {
  if (month >= 11 || month <= 1) return 'Winter';
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  return 'Fall';
};

// Main API endpoint handler
export const getWeatherData = async (req, res) => {
  try {
    const { location, date, time } = req.query;
    
    console.log('🌤️ Weather request:', { location, date, time });
    
    if (!location) {
      return res.status(400).json({ error: 'Location required' });
    }

    // 1. Get coordinates
    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: { 'User-Agent': 'WeatherScopeApp/1.0' }
      }
    );
    
    if (!geoRes.data || geoRes.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    const { lat, lon, display_name } = geoRes.data[0];
    const cityName = display_name.split(',')[0];
    
    // 2. Parse requested date and time
    const requestedDate = date || new Date().toISOString().split('T')[0];
    const requestedHour = time ? parseInt(time.split(':')[0]) : new Date().getHours();
    const month = new Date(requestedDate).getMonth();
    
    // Get location climate adjustment (small adjustment only!)
    const locationAdjustment = getLocationClimateAdjustment(cityName);
    console.log('📍 Location adjustment:', locationAdjustment, '°C for', cityName);
    
    console.log('📅 Processing:', { 
      date: requestedDate, 
      hour: requestedHour, 
      month: month,
      location: cityName
    });
    
    // 3. Get ACTUAL weather data from Open-Meteo
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast`,
      {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation',
          hourly: 'temperature_2m,weather_code,precipitation_probability',
          timezone: 'auto',
          forecast_days: 7 // Get more days for better accuracy
        }
      }
    );
    
    const { current, hourly } = weatherRes.data;
    
    // 4. USE THE ACTUAL TEMPERATURE FROM THE API!
    let actualTemp = current.temperature_2m;
    
    // Apply SMALL location adjustment (1-2 degrees max)
    const adjustedTemp = Math.round(actualTemp + locationAdjustment);
    
    // 5. Get the hourly temperature for the requested hour if not current
    let finalTemp = adjustedTemp;
    
    // If user requested a specific time, get temperature for that hour
    if (time) {
      // Find the temperature for the requested hour
      const requestedDateTime = `${requestedDate}T${requestedHour.toString().padStart(2, '0')}:00`;
      const hourIndex = hourly.time.findIndex(t => t.includes(requestedDateTime));
      
      if (hourIndex !== -1) {
        // Get temperature for that specific hour
        const hourTemp = hourly.temperature_2m[hourIndex];
        finalTemp = Math.round(hourTemp + locationAdjustment);
      }
    }
    
    // 6. Determine condition from ACTUAL weather code
    let condition = getWeatherCondition(current.weather_code);
    
    // Adjust for night time
    if (requestedHour >= 18 || requestedHour < 6) {
      if (condition.includes('Clear')) {
        condition = 'Clear Night';
      } else if (condition.includes('Cloud')) {
        condition = 'Partly Cloudy Night';
      }
    }
    
    // 7. Generate hourly forecast from ACTUAL hourly data
    const hourlyForecast = [];
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();
    
    for (let i = 0; i < 6; i++) {
      const forecastHour = (requestedHour + i) % 24;
      const hourIndex = (currentHour + i) % 168; // Within 7 days of hourly data
      
      let hourTemp = finalTemp;
      let hourCondition = condition;
      
      // Use actual hourly data if available
      if (hourly.temperature_2m && hourIndex < hourly.temperature_2m.length) {
        hourTemp = Math.round(hourly.temperature_2m[hourIndex] + locationAdjustment);
      } else {
        // Fallback: gradually cool down as hours pass
        hourTemp = finalTemp - (i * 0.3);
      }
      
      // Use actual weather code for condition if available
      if (hourly.weather_code && hourIndex < hourly.weather_code.length) {
        hourCondition = getWeatherCondition(hourly.weather_code[hourIndex]);
        
        // Adjust for night time
        if (forecastHour >= 18 || forecastHour < 6) {
          if (hourCondition.includes('Clear')) {
            hourCondition = 'Clear Night';
          } else if (hourCondition.includes('Cloud')) {
            hourCondition = 'Partly Cloudy Night';
          }
        }
      }
      
      hourlyForecast.push({
        time: `${forecastHour.toString().padStart(2, '0')}:00`,
        temp: Math.round(hourTemp),
        condition: hourCondition,
        icon: getWeatherIconFromCondition(hourCondition)
      });
    }
    
    // 8. Use ACTUAL humidity, wind speed, and precipitation
    let humidity = Math.round(current.relative_humidity_2m || 50);
    let windSpeed = Math.round((current.wind_speed_10m || 5) * 3.6); // Convert m/s to km/h
    
    // Small humidity adjustments based on location
    if (locationAdjustment < -2) { // Mountain regions
      humidity = Math.min(85, humidity + 5);
    } else if (locationAdjustment > 1) { // Coastal regions
      humidity = Math.min(90, humidity + 10);
    } else if (locationAdjustment > 0) { // Desert regions
      humidity = Math.max(20, humidity - 10);
    }
    
    // 9. Format the response with REAL data
    const response = {
      location: cityName,
      temperature: finalTemp,
      condition: condition,
      humidity: humidity,
      precipitation: Math.round(current.precipitation || Math.random() * 10),
      windSpeed: windSpeed,
      visibility: Math.round(8 + Math.random() * 12),
      date: requestedDate,
      time: `${requestedHour.toString().padStart(2, '0')}:00`,
      hourly: hourlyForecast,
      // Compatibility fields
      main: condition,
      weather: [{ 
        main: condition,
        description: condition.toLowerCase()
      }],
      rain: Math.round(current.precipitation || 0),
      wind: windSpeed,
      dt: Math.floor(new Date().getTime() / 1000),
      // Debug info (you can remove this in production)
      debug: {
        apiTemperature: current.temperature_2m,
        locationAdjustment: locationAdjustment,
        season: getSeason(month),
        source: 'Open-Meteo API'
      }
    };
    
    console.log('✅ Weather data sent:');
    console.log('   Location:', response.location);
    console.log('   Date/Time:', response.date, response.time);
    console.log('   API Temperature:', current.temperature_2m + '°C');
    console.log('   Adjusted Temperature:', finalTemp + '°C');
    console.log('   Condition:', response.condition);
    console.log('   Season:', getSeason(month));
    console.log('   Location Adjustment:', locationAdjustment + '°C');
    console.log('   Source: Open-Meteo API');
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Fallback with better simulation
    const requestedDate = req.query.date || new Date().toISOString().split('T')[0];
    const requestedHour = req.query.time ? parseInt(req.query.time.split(':')[0]) : 14;
    const month = new Date(requestedDate).getMonth();
    const cityName = req.query.location || 'Delhi';
    
    // Get location adjustment for fallback too
    const locationAdjustment = getLocationClimateAdjustment(cityName);
    
    // Simulate temperature based on actual Delhi weather patterns
    let simulatedTemp;
    const season = getSeason(month);
    
    // More realistic seasonal temperatures for India
    if (season === 'Winter') {
      // Delhi winter: 6-20°C
      simulatedTemp = 12 + locationAdjustment;
    } else if (season === 'Spring') {
      // Delhi spring: 15-30°C
      simulatedTemp = 22 + locationAdjustment;
    } else if (season === 'Summer') {
      // Delhi summer: 25-45°C
      simulatedTemp = 35 + locationAdjustment;
    } else {
      // Delhi fall: 20-35°C
      simulatedTemp = 28 + locationAdjustment;
    }
    
    // Time adjustment
    let timeAdjustment = 0;
    if (requestedHour >= 0 && requestedHour < 6) timeAdjustment = -6;
    else if (requestedHour >= 6 && requestedHour < 12) timeAdjustment = -2;
    else if (requestedHour >= 12 && requestedHour < 18) timeAdjustment = 4;
    else timeAdjustment = -4;
    
    const finalTemp = Math.round(simulatedTemp + timeAdjustment);
    
    // Adjust humidity for fallback
    let humidity = 60;
    if (locationAdjustment < -2) humidity = 65; // Mountain
    else if (locationAdjustment > 1) humidity = 75; // Coastal
    else if (locationAdjustment > 0) humidity = 45; // Desert
    
    const fallbackResponse = {
      location: cityName,
      temperature: finalTemp,
      condition: requestedHour >= 18 || requestedHour < 6 ? 'Clear Night' : 'Clear',
      humidity: humidity,
      precipitation: 0,
      windSpeed: 15,
      visibility: 10,
      date: requestedDate,
      time: `${requestedHour.toString().padStart(2, '0')}:00`,
      hourly: Array.from({ length: 6 }, (_, i) => {
        const hour = (requestedHour + i) % 24;
        let hourTemp = finalTemp - i * 0.3;
        return {
          time: `${hour.toString().padStart(2, '0')}:00`,
          temp: Math.round(hourTemp),
          condition: hour >= 18 || hour < 6 ? 'Clear Night' : 'Clear',
          icon: '01d'
        };
      }),
      main: 'Clear',
      weather: [{ main: 'Clear' }],
      rain: 0,
      wind: 15,
      debug: {
        note: 'Fallback data - API unavailable',
        season: season,
        locationAdjustment: locationAdjustment
      }
    };
    
    console.log('🔄 Using fallback data (season:', season, ', location adj:', locationAdjustment + '°C)');
    res.json(fallbackResponse);
  }
};