import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_NAME__: JSON.stringify('event-booking-web-app')
  },
  server: {
    port: 5173
  }
});
