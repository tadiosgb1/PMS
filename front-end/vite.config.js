
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  assetsInclude: ['**/*.PNG', '**/*.JPG'],
  logLevel: 'info', // or 'debug'
  plugins: [
    vue(),
    commonjs()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['rtcpeerconnection-shim', 'sdp']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: 'all',  // ✅ Correct RegExp format
  }
})