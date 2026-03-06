import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/board',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
