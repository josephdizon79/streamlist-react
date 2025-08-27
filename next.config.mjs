// next.config.mjs
import withPWA from '@ducanh2912/next-pwa';

const isProd = process.env.NODE_ENV === 'production';

// 1) configure the PWA plugin
const withPWAConfigured = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: ({ request }) =>
          request.destination === 'style' ||
          request.destination === 'script' ||
          request.destination === 'worker',
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'static-assets' }
      },
      {
        urlPattern: ({ request, url }) =>
          request.destination === 'image' || url.hostname === 'image.tmdb.org',
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }
        }
      },
      {
        urlPattern: ({ url }) =>
          url.pathname.startsWith('/api/') || url.hostname.includes('themoviedb.org'),
        handler: 'NetworkFirst',
        options: { cacheName: 'api', networkTimeoutSeconds: 3 }
      }
    ]
  }
});

// 2) pass your base Next config to the wrapper
export default withPWAConfigured({
  reactStrictMode: true
});
