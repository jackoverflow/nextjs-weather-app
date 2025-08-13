# OpenWeatherMap API Documentation

## Overview
This document provides a step-by-step guide on how to create and use the OpenWeatherMap API to fetch weather data for your applications.

## Step 1: Sign Up for an API Key
1. Go to the [OpenWeatherMap website](https://openweathermap.org/).
2. Click on the **Sign Up** button to create a new account.
3. After signing up, log in to your account.
4. Navigate to the **API keys** section in your account dashboard.
5. Generate a new API key. This key will be used to authenticate your requests.

## Step 2: Understand the API Endpoints
OpenWeatherMap provides various endpoints to access different types of weather data. The most commonly used endpoints are:

### Current Weather Data Endpoint
- **URL**: `https://api.openweathermap.org/data/2.5/weather`
- **Parameters**:
  - `q`: City name (e.g., `q=London`)
  - `appid`: Your API key (e.g., `appid=YOUR_API_KEY`)
  - `units`: Units of measurement (optional, e.g., `units=metric` for Celsius)

### 5-Day / 3-Hour Forecast Endpoint
- **URL**: `https://api.openweathermap.org/data/2.5/forecast`
- **Parameters**:
  - `q`: City name (e.g., `q=London`)
  - `appid`: Your API key (e.g., `appid=YOUR_API_KEY`)
  - `units`: Units of measurement (optional, e.g., `units=metric` for Celsius)
- **Description**: Provides weather data in 3-hour intervals for 5 days (40 data points total)

### Example Requests
```plaintext
# Current Weather
GET https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric

# 5-Day Forecast
GET https://api.openweathermap.org/data/2.5/forecast?q=London&appid=YOUR_API_KEY&units=metric
```

## Step 3: Making API Requests
You can make API requests using various methods, such as using `fetch` in JavaScript. Here are examples of how to fetch weather data:

### Example Code (JavaScript)
```javascript
// Fetch current weather
const fetchCurrentWeather = async (city) => {
    const apiKey = process.env.API_KEY;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

// Fetch 5-day forecast
const fetchForecast = async (city) => {
    const apiKey = process.env.API_KEY;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        throw new Error(`Error fetching forecast data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};
```

## Step 4: Handling API Responses

### Current Weather Response Structure
```json
{
    "coord": {"lon": -0.1257, "lat": 51.5085},
    "weather": [{"id": 300, "main": "Drizzle", "description": "light intensity drizzle", "icon": "09d"}],
    "base": "stations",
    "main": {
        "temp": 280.32,
        "feels_like": 278.99,
        "temp_min": 279.15,
        "temp_max": 281.15,
        "pressure": 1012,
        "humidity": 81
    },
    "visibility": 10000,
    "wind": {"speed": 4.1, "deg": 80},
    "clouds": {"all": 90},
    "dt": 1485789600,
    "sys": {"type": 1, "id": 5091, "message": 0.0103, "country": "GB", "sunrise": 1485762037, "sunset": 1485810128},
    "id": 2643743,
    "name": "London",
    "cod": 200
}
```

### Forecast Response Structure
```json
{
    "cod": "200",
    "message": 0,
    "cnt": 40,
    "list": [
        {
            "dt": 1485789600,
            "main": {
                "temp": 280.32,
                "feels_like": 278.99,
                "temp_min": 279.15,
                "temp_max": 281.15,
                "pressure": 1012,
                "humidity": 81
            },
            "weather": [{"id": 300, "main": "Drizzle", "description": "light intensity drizzle", "icon": "09d"}],
            "clouds": {"all": 90},
            "wind": {"speed": 4.1, "deg": 80},
            "visibility": 10000,
            "pop": 0.32,
            "sys": {"pod": "d"},
            "dt_txt": "2017-01-30 15:00:00"
        }
    ],
    "city": {
        "id": 2643743,
        "name": "London",
        "coord": {"lat": 51.5085, "lon": -0.1257},
        "country": "GB",
        "population": 1000000,
        "timezone": 0,
        "sunrise": 1485762037,
        "sunset": 1485810128
    }
}
```

## Step 5: Error Handling
When making API requests, it's important to handle errors gracefully. Check the response status and provide appropriate feedback to the user if an error occurs.

### Example Error Handling
```javascript
try {
    const weatherData = await fetchCurrentWeather('London');
    const forecastData = await fetchForecast('London');
    console.log('Current weather:', weatherData);
    console.log('Forecast:', forecastData);
} catch (error) {
    console.error('Error fetching weather data:', error.message);
}
```

## Step 6: Rate Limits and Best Practices
- **Free tier**: 60 calls/minute for current weather, 60 calls/minute for forecast
- **Paid tiers**: Higher limits available
- Cache responses when possible to avoid hitting rate limits
- Use appropriate error handling for different HTTP status codes

## Conclusion
By following these steps, you can successfully create and use the OpenWeatherMap API to fetch both current weather and forecast data for your applications. Make sure to refer to the [OpenWeatherMap API documentation](https://openweathermap.org/api) for more details and advanced features. 