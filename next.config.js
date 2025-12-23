/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turn off React StrictMode for now, as react-aria (used by Plasmic)
  // has some troubles with it. See
  // https://github.com/adobe/react-spectrum/labels/strict%20mode
  reactStrictMode: false,

  // Transpile lucide-react for proper ESM/CJS handling
  transpilePackages: ['lucide-react'],

  async redirects() {
    return [
      // Commented out to allow local /search and /newsletter pages
      // {
      //   source: '/search/:path*',
      //   destination: 'https://app.hecto.io/search/:path*',
      //   permanent: false,
      // },
      {
        source: '/creators',
        destination: 'https://www.hecto.io/newsletter-creators',
        permanent: false,
      },
      {
        source: '/checkout/:path*',
        destination: 'https://app.hecto.io/checkout/:path*',
        permanent: false,
      },
      {
        source: '/newsletter-creators/:path*',
        destination: 'https://app.hecto.io/campaigns/:path*',
        permanent: false,
      },
      {
        source: '/newsletters/:path*',
        destination: 'https://app.hecto.io/newsletters/:path*',
        permanent: false,
      },
      // Commented out to allow local /newsletter/[id] detail pages
      // {
      //   source: '/newsletter/:path*',
      //   destination: 'https://app.hecto.io/newsletter/:path*',
      //   permanent: false,
      // },
      {
        source: '/account/:path*',
        destination: 'https://app.hecto.io',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
