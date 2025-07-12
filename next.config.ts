import withPWA from 'next-pwa';

const nextConfig = {
  // other Next.js config options
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});
