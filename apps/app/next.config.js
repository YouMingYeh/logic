const getEnv = key => {
  const value = process.env[key];
  if (!value) throw Error(`Missing environment variable: ${key}`);
  return value;
};

const withPWA = require('next-pwa')({
  dest: 'public', // Destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  register: true, // Register the PWA service worker
});

const config = {
  reactStrictMode: true,
  transpilePackages: ['ui', 'tailwind-config'],
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  publicRuntimeConfig: {
    appUrl: getEnv('NEXT_APP_URL'),
    supaBaseUrl: getEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supaKey: getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tyuyympekqiefedqpziu.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// TODO: refactor to use the exported envs. Used now as a check
module.exports = withPWA(config);
