export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = async (options: NotificationOptions): Promise<void> => {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) {
    console.warn('Notification permission not granted');
    return;
  }

  if ('serviceWorker' in navigator) {
    // Use service worker for better notification handling
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(options.title, {
      body: options.body,
      icon: options.icon || '/icon/icon-192x192.png',
      badge: options.badge || '/icon/icon-192x192.png',
      tag: options.tag || 'weather-update',
      requireInteraction: false,
      data: {
        url: '/weather'
      }
    });
  } else {
    // Fallback to regular notification
    new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/icon/icon-192x192.png'
    });
  }
};

export const scheduleWeatherNotification = (weatherData: any): void => {
  const weatherCondition = weatherData.weather[0].main.toLowerCase();
  const temperature = Math.round(weatherData.main.temp);
  const city = weatherData.name;
  
  let notificationBody = `Current weather in ${city}: ${temperature}°C, ${weatherData.weather[0].description}`;
  
  // Add weather-specific alerts
  if (weatherCondition.includes('rain')) {
    notificationBody += ' ☔ Don\'t forget your umbrella!';
  } else if (temperature > 30) {
    notificationBody += ' ☀️ It\'s quite hot, stay hydrated!';
  } else if (temperature < 5) {
    notificationBody += ' 🧥 Bundle up, it\'s cold outside!';
  }
  
  showNotification({
    title: '🌤️ Weather Update',
    body: notificationBody,
    tag: 'weather-current'
  });
}; 