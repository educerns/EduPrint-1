import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",   // ✅ Prevent IPv6 WS issues
    port: 8080,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 8080,        // ✅ Same as server port
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "react": path.resolve(__dirname, "./node_modules/react"),
    "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
  },
},
}));
