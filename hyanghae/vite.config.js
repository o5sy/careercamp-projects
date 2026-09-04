import { defineConfig } from "vite";

export default defineConfig({
  base: `/preview/${process.env.WORKSPACE_ID || "295-nngbc1-1786003538583"}/`,
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
