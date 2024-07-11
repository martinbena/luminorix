/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      "mongodb-client-encryption": false,
      aws4: false,
    };

    return config;
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    STRIPE_COUNTRY_CODES: process.env.STRIPE_COUNTRY_CODES,
  },
};

export default nextConfig;
