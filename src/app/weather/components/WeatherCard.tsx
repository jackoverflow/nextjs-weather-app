"use client";

import React from 'react';

interface Weather {
  city: string;
  temperature: number;
  description: string;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: number;
  pressure?: number;
}

const WeatherCard: React.FC<{ weather: Weather }> = ({ weather }) => {
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="weather-card">
      <h2>{weather.city}</h2>
      <div className="temperature">{Math.round(weather.temperature)}°C</div>
      <div className="description">
        <span className="weather-icon">{getWeatherIcon(weather.description)}</span>
        <span>{weather.description}</span>
      </div>
      
      {(weather.humidity || weather.windSpeed || weather.feelsLike || weather.pressure) && (
        <div className="weather-details">
          {weather.feelsLike && (
            <div className="weather-detail-item">
              <div className="weather-detail-label">Feels like</div>
              <div className="weather-detail-value">{Math.round(weather.feelsLike)}°C</div>
            </div>
          )}
          {weather.humidity && (
            <div className="weather-detail-item">
              <div className="weather-detail-label">Humidity</div>
              <div className="weather-detail-value">{weather.humidity}%</div>
            </div>
          )}
          {weather.windSpeed && (
            <div className="weather-detail-item">
              <div className="weather-detail-label">Wind Speed</div>
              <div className="weather-detail-value">{weather.windSpeed} m/s</div>
            </div>
          )}
          {weather.pressure && (
            <div className="weather-detail-item">
              <div className="weather-detail-label">Pressure</div>
              <div className="weather-detail-value">{weather.pressure} hPa</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherCard; 