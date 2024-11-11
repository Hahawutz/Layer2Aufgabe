import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import { env } from 'process';

const target = env.ASPNETCORE_HTTPS_PORT 
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : env.ASPNETCORE_URLS 
    ? env.ASPNETCORE_URLS.split(';')[0] 
    : 'http://localhost:7240'; // Set default target to http

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/Customers': {
                target,
                secure: false
            }
        },
        port: 5173
        // HTTPS configuration is omitted to default to HTTP
    }
})
