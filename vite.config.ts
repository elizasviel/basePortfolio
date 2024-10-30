import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/0x": {
        target: "https://api.0x.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/0x/, ""),
        headers: {
          //NORMAN BURNER
          "0x-api-key": "c2b77edb-78b8-4b99-aea2-e38169c137cd",
          "0x-version": "v2",
        },
      },
    },
  },
});
