# Weather App

This is a [Next.js](https://nextjs.org) project that provides weather information based on user input. It fetches data from the OpenWeatherMap API and displays it in a user-friendly format with **hourly forecasts and auto-refresh capabilities**.

## Features

- **Current Weather**: Real-time weather data for any city
- **Hourly Forecast**: 24-hour weather forecast with 3-hour intervals
- **Auto-refresh**: Weather data automatically updates every 30 minutes
- **Location-based Weather**: Get weather for your current location
- **Interactive Map**: Visual representation of weather location
- **Responsive Design**: Works on desktop and mobile devices
- **Weather Notifications**: Browser notifications for weather updates

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## OpenWeatherMap API Integration
To integrate the OpenWeatherMap API into your application, follow these steps:

1. **Read the OpenWeatherMap API Documentation**:  
   Refer to the [OpenWeatherMap API Documentation](src/app/weather/OpenWeatherMapAPI_Documentation.md) for detailed instructions on how to sign up for an API key, understand the API endpoints, and make requests.

2. **Create a `.env.local` File**:  
   Store your API key securely by creating a `.env.local` file in the root of your project. Add the following line to the file:
   ```plaintext
   API_KEY=your_openweathermap_api_key_here
   ```

3. **Access the API Key in Your Code**:  
   Use `process.env.API_KEY` in your application to access the API key securely.

## Weather Data Features

### Current Weather
- Temperature (current, feels like)
- Weather description and conditions
- Humidity, wind speed, and pressure
- Location coordinates

### Hourly Forecast
- 24-hour weather predictions
- 3-hour interval updates
- Temperature, conditions, and precipitation probability
- Visual weather icons

### Auto-refresh System
- Automatic weather updates every 30 minutes
- Real-time data synchronization
- Last updated timestamp display
- Error handling for failed updates

## OpenLayers Map Integration

The OpenLayers library is used in this application to display an interactive map with the weather location. The map is rendered in the `MapComponent` component, which takes latitude and longitude as props and provides advanced mapping capabilities.

### How Location is Determined
1. **Fetching Weather Data**: When a user searches for a city using the `SearchBar`, the `fetchWeather` function is called. This function makes a request to the OpenWeatherMap API to retrieve weather data for the specified city.

2. **Extracting Coordinates**: The API response includes geographical coordinates (latitude and longitude) for the city. These coordinates are extracted from the response and stored in the `weather` state.

3. **Map Rendering**: The `MapComponent` receives these coordinates as props and renders an interactive map centered on the weather location.

## Project Structure

```
src/app/weather/
├── components/
│   ├── WeatherCard.tsx          # Current weather display
│   ├── HourlyForecast.tsx       # Hourly forecast component
│   ├── SearchBar.tsx            # City search functionality
│   ├── LocationButton.tsx       # Location-based weather
│   └── MapComponent.tsx         # Interactive map
├── services/
│   ├── weatherService.ts        # Weather API integration
│   ├── locationService.ts       # Geolocation services
│   └── notificationService.ts   # Browser notifications
├── styles/
│   └── WeatherStyles.css        # Weather app styling
└── page.tsx                     # Main weather page
```

## API Endpoints Used

- **Current Weather**: `/data/2.5/weather` - Real-time weather data
- **5-Day Forecast**: `/data/2.5/forecast` - 3-hour interval forecasts
- **Rate Limits**: 60 calls/minute for free tier

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **OpenWeatherMap API**: Weather data provider
- **OpenLayers**: Interactive mapping
- **CSS3**: Modern styling with backdrop filters
- **Service Workers**: Offline capabilities and notifications

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
