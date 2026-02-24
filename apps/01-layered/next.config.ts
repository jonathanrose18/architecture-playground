import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   reactCompiler: true,
   transpilePackages: ['@workspace/database'],
};

export default nextConfig;
