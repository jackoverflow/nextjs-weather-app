"use client";

import React from 'react';
import { ForecastData } from '../services/weatherService';

interface HourlyForecastProps {
  forecast: ForecastData[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  const getWeatherIcon = (weatherId: number): string => {
    // Map weather IDs to emoji icons
    if (weatherId >= 200 && weatherId < 300) return '⛈️'; // Thunderstorm
    if (weatherId >= 300 && weatherId < 400) return '🌧️'; // Drizzle
    if (weatherId >= 500 && weatherId < 600) return '🌧️'; // Rain
    if (weatherId >= 600 && weatherId < 700) return '❄️'; // Snow
    if (weatherId >= 700 && weatherId < 800) return '🌫️'; // Atmosphere (fog, mist)
    if (weatherId === 800) return '☀️'; // Clear
    if (weatherId >= 801 && weatherId < 900) return '☁️'; // Clouds
    return '🌤️'; // Default
  };

  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <div className="hourly-forecast">
      <h3>Hourly Forecast</h3>
      <div className="hourly-scroll">
        <div className="hourly-container">
          {forecast.map((item, index) => (
            <div key={index} className="hourly-item">
              <div className="hourly-time">
                <div className="hourly-date">{formatDate(item.dt)}</div>
                <div className="hourly-hour">{formatTime(item.dt)}</div>
              </div>
              <div className="hourly-icon">
                {getWeatherIcon(item.weather[0].id)}
              </div>
              <div className="hourly-temp">
                {Math.round(item.main.temp)}°C
              </div>
              <div className="hourly-description">
                {item.weather[0].description}
              </div>
              {item.pop > 0 && (
                <div className="hourly-pop">
                  {Math.round(item.pop * 100)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
