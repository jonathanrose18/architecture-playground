import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   reactCompiler: true,
   transpilePackages: ['@workspace/database', '@workspace/ui'],
   async redirects() {
      return [
         {
            source: '/',
            destination: '/contacts',
            permanent: true,
         },
      ];
   },
};

export default nextConfig;
