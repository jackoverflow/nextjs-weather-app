import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Weather App</h1>
      <Link href="/weather">Go to Weather Page</Link>
    </div>
  );
};

export default HomePage;
