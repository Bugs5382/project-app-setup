// @ts-nocheck
import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    hmr: {host: 'localhost', protocol: 'ws'},
  },
  plugins: [react(), basicSsl()],
})