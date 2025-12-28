import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // Store cache outside OneDrive to prevent EPERM errors
    cacheDir: 'C:/temp/vite-cache/dss-ahp',
});
