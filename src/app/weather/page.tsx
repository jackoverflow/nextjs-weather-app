"use client";

import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import LocationButton from './components/LocationButton';
import HourlyForecast from './components/HourlyForecast';
import { scheduleWeatherNotification } from './services/notificationService';
import { getCurrentLocation, getLocationFromCoords } from './services/locationService';
import { 
  fetchWeatherAndForecast, 
  getHourlyForecast, 
  startWeatherAutoRefresh,
  WeatherResponse,
  WeatherData 
} from './services/weatherService';
import dynamic from 'next/dynamic';
import './styles/WeatherStyles.css';

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

interface WeatherPageState {
  current: WeatherData | null;
  forecast: any[];
  lastUpdated: number | null;
}

const WeatherPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherPageState>({
    current: null,
    forecast: [],
    lastUpdated: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedLocationWeather, setHasLoadedLocationWeather] = useState(false);
  const [autoRefreshCleanup, setAutoRefreshCleanup] = useState<(() => void) | null>(null);

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
            timestamp: data.dt * 1000,
          };
          
          setWeatherData({
            current: weatherData,
            forecast: [],
            lastUpdated: Date.now()
          });
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

  // Cleanup auto-refresh on unmount
  useEffect(() => {
    return () => {
      if (autoRefreshCleanup) {
        autoRefreshCleanup();
      }
    };
  }, [autoRefreshCleanup]);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Stop any existing auto-refresh
      if (autoRefreshCleanup) {
        autoRefreshCleanup();
      }

      const data: WeatherResponse = await fetchWeatherAndForecast(city);
      
      setWeatherData({
        current: data.current,
        forecast: data.forecast,
        lastUpdated: data.lastUpdated
      });
      
      // Start auto-refresh for this city
      const cleanup = startWeatherAutoRefresh(
        city,
        (updatedData: WeatherResponse) => {
          setWeatherData({
            current: updatedData.current,
            forecast: updatedData.forecast,
            lastUpdated: updatedData.lastUpdated
          });
        },
        (error: string) => {
          console.error('Auto-refresh error:', error);
        }
      );
      
      setAutoRefreshCleanup(() => cleanup);
      
      // Send notification for searched weather
      scheduleWeatherNotification({
        weather: [{ main: data.current.description, description: data.current.description }],
        main: { temp: data.current.temperature },
        name: data.current.city
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching weather data.';
      setError(errorMessage);
      console.error('Error fetching weather data:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationWeather = (weatherData: WeatherData) => {
    setWeatherData({
      current: weatherData,
      forecast: [],
      lastUpdated: Date.now()
    });
  };

  const backgroundClass = weatherData.current ? getBackgroundClass(weatherData.current.description) : '';
  const hourlyForecast = getHourlyForecast(weatherData.forecast);

  return (
    <div className={`weather-page ${backgroundClass}`}>
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

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {weatherData.current && !loading && (
        <div className="weather-content">
          <WeatherCard weather={weatherData.current} />
          
          {hourlyForecast.length > 0 && (
            <HourlyForecast forecast={hourlyForecast} />
          )}
          
          {weatherData.current.lat && weatherData.current.lon && (
            <MapComponent 
              lat={weatherData.current.lat} 
              lon={weatherData.current.lon} 
              city={weatherData.current.city} 
            />
          )}
          
          {weatherData.lastUpdated && (
            <div className="last-updated">
              <small>
                Last updated: {new Date(weatherData.lastUpdated).toLocaleTimeString()}
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherPage; 