import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      tailwindcss(),
    ],
    root: path.resolve(__dirname, 'src/frontend'),
    base: '/',
    server: {
      port: 8000,
      watch: {
        usePolling: true
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, './src/frontend/index.html')
        }
      },
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      assetsDir: 'assets'
    },
    publicDir: path.resolve(__dirname, 'public'),
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    }
  }
})
