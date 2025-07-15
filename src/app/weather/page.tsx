"use client";

import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import LocationButton from './components/LocationButton';
import { scheduleWeatherNotification } from './services/notificationService';
import { getCurrentLocation, getLocationFromCoords } from './services/locationService';
import dynamic from 'next/dynamic';
import './styles/WeatherStyles.css';

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  pressure: number;
  lat: number;
  lon: number;
}

const WeatherPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoadedLocationWeather, setHasLoadedLocationWeather] = useState(false);

  const getBackgroundClass = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear') || desc.includes('sunny')) return 'sunny';
    if (desc.includes('rain') || desc.includes('drizzle')) return 'rainy';
    if (desc.includes('cloud')) return 'cloudy';
    return '';
  };

  // Auto-load user's location weather on first visit
  useEffect(() => {
    const loadLocationWeatherOnStart = async () => {
      if (!hasLoadedLocationWeather) {
        try {
          const location = await getCurrentLocation();
          const data = await getLocationFromCoords(location.latitude, location.longitude);
          
          const weatherData: WeatherData = {
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            feelsLike: data.main.feels_like,
            pressure: data.main.pressure,
            lat: data.coord.lat,
            lon: data.coord.lon,
          };
          
          setWeather(weatherData);
          setHasLoadedLocationWeather(true);
          
          // Send notification for location weather
          scheduleWeatherNotification(data);
        } catch {
          console.log('Location not available or permission denied, user will need to search manually');
          setHasLoadedLocationWeather(true);
        }
      }
    };

    loadLocationWeatherOnStart();
  }, [hasLoadedLocationWeather]);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=98e3dbff77b31f38d9fb4c246b8ee063&units=metric`);
      if (!response.ok) {
        console.error(`City "${city}" not found. Please check the spelling or try a different city.`);
        return;
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: data.main.feels_like,
        pressure: data.main.pressure,
        lat: data.coord.lat,
        lon: data.coord.lon,
      };
      setWeather(weatherData);
      
      // Send notification for searched weather
      scheduleWeatherNotification(data);
    } catch {
      console.error('Error fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationWeather = (weatherData: WeatherData) => {
    setWeather(weatherData);
  };

  const backgroundClass = weather ? getBackgroundClass(weather.description) : '';

  return (
    <div className={`weather-page ${backgroundClass}`}>
      <h1>Leeyo&apos;s Weather App</h1>
      <div className="search-controls">
        <SearchBar onSearch={fetchWeather} />
        <LocationButton 
          onLocationWeather={handleLocationWeather}
          onError={() => {}}
          onLoading={setLoading}
        />
      </div>
      
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Fetching weather data...</p>
        </div>
      )}

      
      {weather && !loading && (
        <div className="weather-content">
          <WeatherCard weather={weather} />
          {weather.lat && weather.lon && <MapComponent lat={weather.lat} lon={weather.lon} city={weather.city} />}
        </div>
      )}
    </div>
  );
};

export default WeatherPage; 