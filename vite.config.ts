import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function saveProfilePlugin(): Plugin {
  return {
    name: 'save-profile-photo',
    configureServer(server) {
      server.middlewares.use('/api/save-profile', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { image } = JSON.parse(body);
              if (image && typeof image === 'string') {
                const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
                const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(image, 'base64');
                const publicDir = path.resolve(process.cwd(), 'public');
                const distDir = path.resolve(process.cwd(), 'dist');
                if (!fs.existsSync(publicDir)) {
                  fs.mkdirSync(publicDir, { recursive: true });
                }
                fs.writeFileSync(path.join(publicDir, 'profile.jpeg'), buffer);
                const metaJson = JSON.stringify({ hasCustomPhoto: true, updatedAt: Date.now() });
                fs.writeFileSync(path.join(publicDir, 'profile-meta.json'), metaJson);
                
                // Keep dist in sync if production build folder exists
                if (fs.existsSync(distDir)) {
                  fs.writeFileSync(path.join(distDir, 'profile.jpeg'), buffer);
                  fs.writeFileSync(path.join(distDir, 'profile-meta.json'), metaJson);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, url: '/profile.jpeg' }));
                return;
              }
            } catch (err) {
              console.error('Failed to save profile image:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid image data' }));
          });
        } else if (req.method === 'DELETE') {
          try {
            const publicDir = path.resolve(__dirname, 'public');
            const file = path.join(publicDir, 'profile.jpeg');
            if (fs.existsSync(file)) fs.unlinkSync(file);
            fs.writeFileSync(path.join(publicDir, 'profile-meta.json'), JSON.stringify({ hasCustomPhoto: false, updatedAt: Date.now() }));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to delete' }));
          }
        } else if (req.method === 'GET') {
          try {
            const metaPath = path.resolve(__dirname, 'public', 'profile-meta.json');
            const hasCustom = fs.existsSync(metaPath) && JSON.parse(fs.readFileSync(metaPath, 'utf8')).hasCustomPhoto;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ hasCustomPhoto: !!hasCustom, url: hasCustom ? '/profile.jpeg' : null }));
          } catch {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ hasCustomPhoto: false, url: null }));
          }
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    root: __dirname,
    base: '/',
    plugins: [react(), tailwindcss(), saveProfilePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '~': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
