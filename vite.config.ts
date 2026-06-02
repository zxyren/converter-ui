import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.PORT) || 5173;
  const basePath = env.BASE_PATH || "/";
  const apiProxyTarget = env.VITE_API_PROXY || "http://127.0.0.1:8001";
  const apiUrl = env.VITE_API_URL || "/api";

  return {
    base: basePath,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },
    server: {
      port: 8080,
      host: "0.0.0.0",
      allowedHosts: true,
      proxy:
        apiUrl === "/api"
          ? {
              "/api": {
                target: apiProxyTarget,
                changeOrigin: true,
                secure: false,
                ws: false,
              },
            }
          : undefined,
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
