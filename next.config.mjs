/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // 必須與網址路徑完全一致
  basePath: process.env.NODE_ENV === "production" ? "/VOCAB-MASTER" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/VOCAB-MASTER/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
