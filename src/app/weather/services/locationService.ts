export interface UserLocation {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    // Check if permission is already granted
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          reject(new Error('Please allow location access to get weather for your current location. You can enable this in your browser settings.'));
          return;
        }
        
        // Proceed with location request
        requestLocation(resolve, reject);
      }).catch(() => {
        // Fallback if permissions API is not available
        requestLocation(resolve, reject);
      });
    } else {
      // Fallback for browsers without permissions API
      requestLocation(resolve, reject);
    }
  });
};

const requestLocation = (resolve: (value: UserLocation) => void, reject: (reason: Error) => void) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      let errorMessage = 'An error occurred while getting your location.';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Please allow location access to get weather for your current location. You can enable this in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable. Please try again or search for a city manually.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          break;
      }
      reject(new Error(errorMessage));
    },
    {
      enableHighAccuracy: false, // Less strict for better compatibility
      timeout: 15000, // Longer timeout
      maximumAge: 600000, // 10 minutes cache
    }
  );
};

export const getLocationFromCoords = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=98e3dbff77b31f38d9fb4c246b8ee063&units=metric`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data for location');
    }
    return await response.json();
  } catch {
    throw new Error('Failed to get weather data for your location');
  }
}; 