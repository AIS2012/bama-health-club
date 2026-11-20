import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WebP encoding of the hero JPEG hangs inside `next start`. Serve resized JPEG instead.
    formats: [],
  },
};

export default nextConfig;
