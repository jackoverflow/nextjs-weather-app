import React, { useState } from 'react';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import dynamic from 'next/dynamic';
import '../styles/WeatherStyles.css';

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import('../components/MapComponent'), {
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
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`);
      if (!response.ok) {
        // Provide a more informative error message
        throw new Error(`City "${city}" not found. Please check the spelling or try a different city. You can also try cities like "Legazpi City" or "Iligan City".`);
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
      console.log('Weather Data:', weatherData);
      console.log('Fetching weather for city:', city);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-page">
      <SearchBar onSearch={fetchWeather} />
      {weather && (
        <>
          <WeatherCard weather={weather} />
          <MapComponent lat={weather.lat} lon={weather.lon} city={weather.city} />
        </>
      )}
    </div>
  );
};

export default WeatherPage; 