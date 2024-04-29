/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@dtos': path.resolve(__dirname, 'src/dtos'),
      '@exceptions': path.resolve(__dirname, 'src/exceptions'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@middlewares': path.resolve(__dirname, 'src/middlewares'),
      '@tests': path.resolve(__dirname, 'src/tests'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
})
