// src/components/CheckForecast.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckForecast = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://weatherscope-gw2z.onrender.com/api/weather?location=${encodeURIComponent(
          formData.location
        )}&date=${formData.date}&time=${formData.time}`
      );

      if (!response.ok) throw new Error("Failed to fetch weather");

      const data = await response.json();

      // ✅ Navigate with both form info and live weather data
      navigate("/home", { state: { ...formData, weatherData: data } });
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Unable to fetch weather. Please try again later.");
    }
  };

  return (
    <div
      className="min-h-screen font-poppins relative flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url('/images/CheckForecast.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center px-4">
        {/* Title Section */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-5xl md:text-6xl font-semibold mb-3 tracking-wide">
            WeatherScope
          </h1>
          <p className="text-white/90 text-lg md:text-xl italic max-w-2xl mx-auto">
            From sunshine to showers, know what's coming for your event.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10 w-full max-w-lg shadow-2xl"
          style={{
            boxShadow: "0px 4px 25px rgba(0,0,0,0.3)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Forecast Your <br />
            <span className="text-[#A7E6FF]">Perfect Day</span>
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-white text-sm font-semibold mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Chicago"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-white text-sm font-semibold mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>

            {/* Time */}
            <div>
              <label
                htmlFor="time"
                className="block text-white text-sm font-semibold mb-2"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#F3F9FA] text-[#162D3A] py-4 rounded-xl font-semibold text-lg hover:bg-[#E8F4F8] transition-all duration-300 shadow-lg"
            >
              Check Forecast
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckForecast;
