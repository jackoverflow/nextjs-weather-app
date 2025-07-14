"use client";

import React, { useState } from 'react';
import { getCurrentLocation, getLocationFromCoords } from '../services/locationService';
import { requestNotificationPermission, scheduleWeatherNotification } from '../services/notificationService';

interface LocationButtonProps {
  onLocationWeather: (weatherData: any) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({ 
  onLocationWeather, 
  onError, 
  onLoading 
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetLocationWeather = async () => {
    setIsGettingLocation(true);
    onLoading(true);
    onError('');

    try {
      // Request notification permission when user interacts with location
      await requestNotificationPermission();

      // Prompt for location access
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Get user's current location
            const location = await getCurrentLocation();
            console.log('User location:', location);

            // Fetch weather for the location
            const weatherData = await getLocationFromCoords(location.latitude, location.longitude);
            console.log('Weather data for location:', weatherData);

            // Transform the data to match the expected format
            const transformedWeatherData = {
              city: weatherData.name,
              temperature: weatherData.main.temp,
              description: weatherData.weather[0].description,
              humidity: weatherData.main.humidity,
              windSpeed: weatherData.wind.speed,
              feelsLike: weatherData.main.feels_like,
              pressure: weatherData.main.pressure,
              lat: weatherData.coord.lat,
              lon: weatherData.coord.lon,
            };

            // Send notification for location weather
            scheduleWeatherNotification(weatherData);

            onLocationWeather(transformedWeatherData);
          },
          (error) => {
            console.log('Error getting location:', error);
            onError('Location access denied. Please enable location access in your browser settings.');
          }
        );
      } else {
        onError('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      console.log('Error getting location weather:', error);
      onError(error instanceof Error ? error.message : 'Failed to get your location weather');
    } finally {
      setIsGettingLocation(false);
      onLoading(false);
    }
  };

  return (
    <button 
      className="location-button"
      onClick={handleGetLocationWeather}
      disabled={isGettingLocation}
    >
      {isGettingLocation ? (
        <>
          <span className="location-spinner"></span>
          Getting location...
        </>
      ) : (
        <>
          📍 Use My Location
        </>
      )}
    </button>
  );
};

export default LocationButton; 