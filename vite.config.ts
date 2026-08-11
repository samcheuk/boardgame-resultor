import type { Connect, Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const BASE_PATH = '/boardgame-tracker';

function redirectBaseWithoutSlash(): Plugin {
  const redirect: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url ?? '';
    const path = url.split('?')[0];
    const query = url.includes('?') ? url.slice(url.indexOf('?')) : '';

    if (path === BASE_PATH) {
      res.statusCode = 302;
      res.setHeader('Location', `${BASE_PATH}/${query}`);
      res.end();
      return;
    }

    next();
  };

  return {
    name: 'redirect-base-without-slash',
    configureServer(server) {
      server.middlewares.use(redirect);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), redirectBaseWithoutSlash()],
  base: `${BASE_PATH}/`,
});
