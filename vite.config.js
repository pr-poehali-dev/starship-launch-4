import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hmrKeepalive = {
  name: "hmr-ws-keepalive",
  configureServer(server) {
    let timer = null;
    const tick = () => {
      server.ws?.send({ type: "ping" });
      timer = setTimeout(tick, 5000 + Math.floor(Math.random() * 4000));
    };
    timer = setTimeout(tick, 5000 + Math.floor(Math.random() * 4000));
    server.httpServer?.on("close", () => {
      if (timer) clearTimeout(timer);
    });
  },
};

export default defineConfig({
  plugins: [hmrKeepalive, react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: "all",
    hmr: {
      timeout: 7000,
      overlay: false,
    },
  },
});
