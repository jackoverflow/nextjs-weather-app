const API_KEY = '98e3dbff77b31f38d9fb4c246b8ee063';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  pressure: number;
  lat: number;
  lon: number;
  timestamp: number;
}

export interface ForecastData {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  pop: number; // Probability of precipitation
}

export interface WeatherResponse {
  current: WeatherData;
  forecast: ForecastData[];
  lastUpdated: number;
}

// Fetch current weather data
export const fetchCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        // Try to suggest corrections for common typos
        const suggestions = getCitySuggestions(city);
        const suggestionText = suggestions.length > 0 
          ? ` Did you mean: ${suggestions.join(', ')}?`
          : '';
        throw new Error(`City "${city}" not found. Please check the spelling or try a different city.${suggestionText}`);
      }
      throw new Error(`City "${city}" not found. Please check the spelling or try a different city.`);
    }
    
    const data = await response.json();
    
    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: data.main.feels_like,
      pressure: data.main.pressure,
      lat: data.coord.lat,
      lon: data.coord.lon,
      timestamp: data.dt * 1000, // Convert to milliseconds
    };
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to suggest city name corrections
const getCitySuggestions = (city: string): string[] => {
  const commonTypos: { [key: string]: string[] } = {
    'legazpi cityt': ['Legazpi City', 'Legazpi'],
    'manila': ['Manila', 'Metro Manila'],
    'cebu': ['Cebu City', 'Cebu'],
    'davao': ['Davao City', 'Davao'],
    'quezon': ['Quezon City', 'Quezon'],
    'caloocan': ['Caloocan City', 'Caloocan'],
    'makati': ['Makati City', 'Makati'],
    'pasig': ['Pasig City', 'Pasig'],
    'paranaque': ['Parañaque City', 'Parañaque'],
    'taguig': ['Taguig City', 'Taguig'],
    'valenzuela': ['Valenzuela City', 'Valenzuela'],
    'las pinas': ['Las Piñas City', 'Las Piñas'],
    'marikina': ['Marikina City', 'Marikina'],
    'mandaluyong': ['Mandaluyong City', 'Mandaluyong'],
    'malabon': ['Malabon City', 'Malabon'],
    'navotas': ['Navotas City', 'Navotas'],
    'san juan': ['San Juan City', 'San Juan'],
    'muntinlupa': ['Muntinlupa City', 'Muntinlupa'],
    'pasay': ['Pasay City', 'Pasay'],
    'pateros': ['Pateros', 'Pateros Municipality'],
    'tondo': ['Tondo', 'Manila'],
    'binondo': ['Binondo', 'Manila'],
    'quiapo': ['Quiapo', 'Manila'],
    'ermita': ['Ermita', 'Manila'],
    'malate': ['Malate', 'Manila'],
    'paco': ['Paco', 'Manila'],
    'pandacan': ['Pandacan', 'Manila'],
    'port area': ['Port Area', 'Manila'],
    'santa ana': ['Santa Ana', 'Manila'],
    'santa cruz': ['Santa Cruz', 'Manila'],
    'sampaloc': ['Sampaloc', 'Manila'],
    'san andres': ['San Andres', 'Manila'],
    'san miguel': ['San Miguel', 'Manila'],
    'san nicolas': ['San Nicolas', 'Manila'],
    'intramuros': ['Intramuros', 'Manila']
  };
  
  const normalizedCity = city.toLowerCase().trim();
  return commonTypos[normalizedCity] || [];
};

// Fetch 5-day forecast data
export const fetchForecast = async (city: string): Promise<ForecastData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast not available for "${city}". Please check the spelling or try a different city.`);
    }
    
    const data = await response.json();
    return data.list || [];
  } catch (error) {
    throw new Error(`Error fetching forecast data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Fetch both current weather and forecast
export const fetchWeatherAndForecast = async (city: string): Promise<WeatherResponse> => {
  try {
    const [currentWeather, forecastData] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city)
    ]);
    
    return {
      current: currentWeather,
      forecast: forecastData,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    throw new Error(`Error fetching weather and forecast: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get hourly forecast for the next 24 hours
export const getHourlyForecast = (forecast: ForecastData[]): ForecastData[] => {
  const now = Date.now();
  const twentyFourHoursFromNow = now + (24 * 60 * 60 * 1000);
  
  return forecast.filter(item => {
    const itemTime = item.dt * 1000;
    return itemTime >= now && itemTime <= twentyFourHoursFromNow;
  });
};

// Get daily forecast (one forecast per day)
export const getDailyForecast = (forecast: ForecastData[]): ForecastData[] => {
  const dailyForecasts: ForecastData[] = [];
  const seenDates = new Set<string>();
  
  forecast.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!seenDates.has(date)) {
      seenDates.add(date);
      dailyForecasts.push(item);
    }
  });
  
  return dailyForecasts.slice(0, 5); // Return next 5 days
};

// Auto-refresh weather data every 30 minutes
export const startWeatherAutoRefresh = (
  city: string,
  onUpdate: (data: WeatherResponse) => void,
  onError: (error: string) => void
): (() => void) => {
  const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
  
  const refreshWeather = async () => {
    try {
      const data = await fetchWeatherAndForecast(city);
      onUpdate(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to refresh weather data');
    }
  };
  
  // Initial fetch
  refreshWeather();
  
  // Set up interval
  const intervalId = setInterval(refreshWeather, REFRESH_INTERVAL);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};
