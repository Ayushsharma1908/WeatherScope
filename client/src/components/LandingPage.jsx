// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-900/90 to-purple-900/90 font-poppins relative"
      style={{
        backgroundImage: `url('/images/LandingPage.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Black overlay with 15% opacity */}
      <div className="absolute inset-0 bg-black/15"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-white">WeatherScope</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-white/90 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-white/90 hover:text-white transition-colors">About</a>
            </div>
            <Link to="/signin">
            <button className="bg-[#F3F9FA] text-[#162D3A] px-6 py-2 rounded-lg hover:bg-[#162D3A] hover:text-[#F3F9FA] transition-colors font-semibold shadow-md">
              Get Started
            </button>
            </Link>
          </div>
          
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              What's next in your weather journey
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Stay prepared with real-time forecasts, climate updates, and insights tailored to your location.  
              From sunny skies to stormy nights — WeatherScope keeps you informed.
            </p>
            <Link to="/signin">
            <button className="bg-[#F3F9FA] text-[#162D3A] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#162D3A] hover:text-[#F3F9FA] transition-colors shadow-md">
              Get Started &gt;&gt;
            </button>
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-t border-white/30"></div>
        </div>

        {/* Features Section */}
        <section id="features" className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="text-center">
                <div 
                  className="rounded-2xl p-6 h-full backdrop-blur-md border border-[#e0e0e0]"
                  style={{
                    backgroundColor: 'rgba(224, 224, 224, 0.15)',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <span className="material-icons text-4xl text-white">event</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Event Forecasts</h3>
                  <p className="text-white/90 leading-relaxed">
                    Get precise weather predictions for your special day — from weddings to concerts.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div 
                  className="rounded-2xl p-6 h-full backdrop-blur-md border border-[#e0e0e0]"
                  style={{
                    backgroundColor: 'rgba(224, 224, 224, 0.15)',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <span className="material-icons text-4xl text-white">schedule</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Hourly Breakdown</h3>
                  <p className="text-white/90 leading-relaxed">
                    Know exactly when rain, sun, or storms are expected during your event.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div 
                  className="rounded-2xl p-6 h-full backdrop-blur-md border border-[#e0e0e0]"
                  style={{
                    backgroundColor: 'rgba(224, 224, 224, 0.15)',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <span className="material-icons text-4xl text-white">notifications</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Smart Alerts</h3>
                  <p className="text-white/90 leading-relaxed">
                    Receive instant updates if sudden weather changes could affect your plans.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="text-center">
                <div 
                  className="rounded-2xl p-6 h-full backdrop-blur-md border border-[#e0e0e0]"
                  style={{
                    backgroundColor: 'rgba(224, 224, 224, 0.15)',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <span className="material-icons text-4xl text-white">verified</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Plan with Confidence</h3>
                  <p className="text-white/90 leading-relaxed">
                    Compare multiple hours and pick the best time for your event.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;