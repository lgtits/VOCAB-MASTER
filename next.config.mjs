/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // 假設你的專案名稱是 my-vocab-app
  basePath: process.env.NODE_ENV === "production" ? "/my-vocab-app" : "",
  images: { unoptimized: true },
};

export default nextConfig;
