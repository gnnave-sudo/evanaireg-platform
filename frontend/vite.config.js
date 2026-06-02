import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { inspectAttr } from 'plugin-inspect-react-code';
// https://vite.dev/config/
export default defineConfig({
    base: './',
    plugins: [inspectAttr(), react()],
    server: {
        port: 3000,
        proxy: {
            '/v1': 'http://localhost:8100',
            '/health': 'http://localhost:8100',
            '/docs': 'http://localhost:8100',
            '/openapi.json': 'http://localhost:8100',
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
