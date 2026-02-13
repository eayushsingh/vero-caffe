/** @type {import('next').NextConfig} */
const nextConfig = {
  // Using only local images for now; remove remotePatterns to prevent Next from proxying
  // remote image requests during development which can cause unstable upstream errors.
  images: {},
};

export default nextConfig;
