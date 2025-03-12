import { createServer } from 'http';
import { readFile } from 'fs';
import { join} from 'path';
import { readdir } from "node:fs/promises";

const PORT = 4000;
const ASSETS_LOCATION = './src/file-server/assets/public/';

const corsHandler = (req, res) => {
    console.log(req.url)
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS requests for CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
}

// ✅ curl http://localhost:4000/api/files/notes/welcome.txt
// ❌ curl http://localhost:4000/api/files/assets/private/flags.txt
// ✅ curl http://localhost:4000/api/files/../../assets/private/flags.txt
// ✅ curl http://localhost:4000/api/files/../../assets/.env
const server = createServer(async (req, res) => {
    corsHandler(req, res);

    // Remove the /api/files prefix and decode URL
    const requestedPath = decodeURIComponent(req.url.replace('/api/files/', ASSETS_LOCATION));

    // Intentionally vulnerable: directly join paths without sanitization
    const filePath = join(process.cwd(), requestedPath);

    console.log('Attempting to read:', filePath);

   if (requestedPath.endsWith('/') || requestedPath === 'public/') {
        try {
            const files = await readdir(filePath);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(files));
        } catch (err) {
            console.error('Directory listing error:', {
                message: err.message,
                code: err.code,
                syscall: err.syscall,
                path: err.path
            });
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Directory not found' }));
        }
    }

    readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
