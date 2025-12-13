// src/components/SignIn.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode"; // ✅ FIXED IMPORT

const SignIn = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Auto-login if already logged in
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      onLogin(savedUser);
      navigate("/checkforecast");
    }
  }, [navigate, onLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name: formData.name,
      email: formData.email,
      picture: null,
    };

    localStorage.setItem("user", JSON.stringify(user));
    onLogin(user);
    navigate("/checkforecast");
  };

  const handleGoogleSuccess = (response) => {
    const decoded = jwtDecode(response.credential);
    console.log("Decoded Google JWT:", decoded);

    // Google profile picture
    let googlePhoto = decoded.picture || null;

    // Convert 96px image → 512px HD if applicable
    if (googlePhoto && googlePhoto.includes("=s96-c")) {
      googlePhoto = googlePhoto.replace("=s96-c", "=s512-c");
    }

    const user = {
      name: decoded.name,
      email: decoded.email,
      picture: googlePhoto, // store actual image
    };

    console.log("Google User:", user); // check image URL here

    localStorage.setItem("user", JSON.stringify(user));
    onLogin(user);
    navigate("/checkforecast");
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };
  // --------------------------------------------------

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-900/90 to-purple-900/90 font-poppins relative"
      style={{
        backgroundImage: `url('/images/signin.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/15"></div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="text-center max-w-md">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Welcome to <br />
              <span className="text-6xl">WeatherScope</span>
            </h1>
            <p className="text-white/90 text-2xl italic mt-8">
              "Your gateway to real-time weather insights ☀️🌧️"
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div
            className="rounded-3xl p-8 md:p-12 w-full max-w-md backdrop-blur-md border border-[#e0e0e0]"
            style={{
              backgroundColor: "rgba(224,224,224,0.15)",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.25)",
            }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Sign in
              </h2>
              <p className="text-white/90 mt-2">
                Sign in and stay ahead of the forecast
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Example@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none"
                  minLength="8"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F3F9FA] text-[#162D3A] py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-[#E8F4F8]"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-white/30"></div>
              <span className="flex-shrink mx-4 text-white/70 text-sm">Or</span>
              <div className="flex-grow border-t border-white/30"></div>
            </div>

            {/* Google Login Button - Updated for consistent sizing */}
            <div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                scope="https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="w-full bg-[#F3F9FA] text-[#162D3A] py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-[#E8F4F8] transition-colors duration-200 flex items-center justify-center gap-3"
                  >
                    {/* Google Icon */}
                    <img
                      src="/images/google-icon.svg"
                      alt="Google"
                      className="w-6 h-6"
                    />
                    Sign in with Google
                  </button>
                )}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
