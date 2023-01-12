import { createServer } from "http";
import { readdirSync } from 'fs';
const host = 'localhost';
const port = 8000;
let mainAdress = '/get';
const requestListener = (req, res) => {
    let isErr = true;
    if (req.url === mainAdress) {
        if (req.method !== 'GET') {
            res.writeHead(405);
            res.end('HTTP method not allowed.');
        } else {
            const files = readdirSync(process.cwd()).join(', ');
            if (!files) {
                res.writeHead(500);
                res.end("Internal server error");
            }
            res.writeHead(200);
            res.end(files);
        }
        isErr = false;
    }
    if (req.url === '/delete') {
        if (req.method !== 'DELETE') {
            res.writeHead(405);
            res.end('HTTP method not allowed.');
        } else {
            res.writeHead(200);
            res.end("succes method delete");
        }
        isErr = false;
    }
    if (req.url === '/post') {
        if (req.method !== 'POST') {
            res.writeHead(405);
            res.end('HTTP method not allowed.');
        } else {
            res.writeHead(200);
            res.end("succes method post");
        }
        isErr = false;
    }
    if (req.url === '/redirect') {
        if (req.method !== 'GET') {
            res.writeHead(405);
            res.end('HTTP method not allowed.');
        } else {
            res.writeHead(200);
            mainAdress = '/redirected';
            res.end(`ресурс теперь постоянно доступен по адресу ${mainAdress}`);
        }
        isErr = false;
    }
    if (isErr) {
        res.writeHead(404);
        res.end('not found');
    }

};

const server = createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
