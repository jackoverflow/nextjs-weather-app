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
OpenWeatherMap provides various endpoints to access different types of weather data. The most commonly used endpoint is the **Current Weather Data** endpoint:

### Current Weather Data Endpoint
- **URL**: `https://api.openweathermap.org/data/2.5/weather`
- **Parameters**:
  - `q`: City name (e.g., `q=London`)
  - `appid`: Your API key (e.g., `appid=YOUR_API_KEY`)
  - `units`: Units of measurement (optional, e.g., `units=metric` for Celsius)

### Example Request
```plaintext
GET https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric
```

## Step 3: Making API Requests
You can make API requests using various methods, such as using `fetch` in JavaScript. Here’s an example of how to fetch weather data for a specific city:

### Example Code (JavaScript)
```javascript
const fetchWeather = async (city) => {
    const apiKey = process.env.API_KEY; // Ensure your API key is stored in an environment variable
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};
```

## Step 4: Handling API Responses
The API will return a JSON response containing weather data. Here’s an example of the response structure:
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

## Step 5: Error Handling
When making API requests, it’s important to handle errors gracefully. Check the response status and provide appropriate feedback to the user if an error occurs.

### Example Error Handling
```javascript
try {
    const weatherData = await fetchWeather('London');
    console.log(weatherData);
} catch (error) {
    console.error('Error fetching weather data:', error.message);
}
```

## Conclusion
By following these steps, you can successfully create and use the OpenWeatherMap API to fetch weather data for your applications. Make sure to refer to the [OpenWeatherMap API documentation](https://openweathermap.org/api) for more details and advanced features. 