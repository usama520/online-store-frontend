/** @type {import('next').NextConfig} */
const remotePatterns = [];

if (process.env.NODE_ENV !== "production") {
  remotePatterns.push({
    protocol: "http",
    hostname: "localhost",
    port: "4000",
    pathname: "/rails/**",
  });
}

if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_API_URL);
    remotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port,
      pathname: "/rails/**",
    });
  } catch {
    // Ignore invalid URL
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
