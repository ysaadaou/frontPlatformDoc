import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3500,
    host: true,
    proxy: {
      "/api": {
        target: "https://back-platform-doc.vercel.app/",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            //console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            //console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            //console.log(
            //  "Received Response from the Target:",
            //  proxyRes.statusCode,
            //  req.url,
            //);
          });
        },
      },
    },
  },
  define: {
    // Make environment variables available
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development",
    ),
  },
});
