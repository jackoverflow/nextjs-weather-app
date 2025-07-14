# Weather App

This is a [Next.js](https://nextjs.org) project that provides weather information based on user input. It fetches data from the OpenWeatherMap API and displays it in a user-friendly format.

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

## Leaflet Map Integration

The Leaflet library is used in this application to display a map with the weather location. The map is rendered in the `MapComponent` component, which takes latitude and longitude as props.

### How Location is Determined
1. **Fetching Weather Data**: When a user searches for a city using the `SearchBar`, the `fetchWeather` function is called. This function makes a request to the OpenWeatherMap API to retrieve weather data for the specified city.

2. **Extracting Coordinates**: The API response includes geographical coordinates (latitude and longitude) for the city. These coordinates are extracted from the response and stored in the `weather` state.

3. **Passing Coordinates to MapComponent**: The `MapComponent` is dynamically imported and rendered in the `WeatherPage` component. It receives the `lat` and `lon` values from the `weather` state as props. This allows the map to center on the correct location based on the fetched weather data.

4. **Rendering the Map**: Inside the `MapComponent`, the `MapContainer` component from Leaflet is used to create the map. The `center` prop is set to the latitude and longitude passed from the `WeatherPage`, ensuring the map displays the correct location. A marker is also placed at this position to indicate the city's location.

### Example Code Snippet
Here is a brief code snippet demonstrating how the coordinates are passed to the `MapComponent`:P
```javascript
{weather.lat && weather.lon && <MapComponent lat={weather.lat} lon={weather.lon} city={weather.city} />}
```

This integration allows users to visually see the weather location on a map, enhancing the overall user experience.

## Learn More
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
