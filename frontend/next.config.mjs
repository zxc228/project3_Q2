/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://188.225.14.199:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
