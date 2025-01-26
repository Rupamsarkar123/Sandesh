// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5175,
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },

//   build: {
//     chunkSizeWarningLimit: 500, // Adjust if necessary
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes("node_modules")) {
//             return id.split("node_modules/")[1].split("/")[0].toString();
//           }
//         },
//       },
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5175,  // Use Render's PORT variable or fallback to 5175 locally
    host: '0.0.0.0',  // Allow connections from Render
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


// // import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },
// });
