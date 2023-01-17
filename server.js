import express from 'express'
import { readdirSync } from 'fs';
import fs from "fs";
import jsonBody from "body/json.js"
// import cookieParser from 'cookie-parser';
import cookie from "cookie"
const app = express();

let mainAdress = '/get';
const user = {
    id: 123,
    username: 'testuser',
    password: 'qwerty'
};
// app.use(cookieParser())
app.all(mainAdress, function (req, res, next) {
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

})
app.all('/delete', function (req, res, next) {
    if (req.method !== 'DELETE') {
        res.writeHead(405);
        res.end('HTTP method not allowed.');
    } else {
        const cookies = cookie.parse(req.headers.cookie || '');
        if (cookies.authorized === "true" && cookies.userId == `${user.id}`) {
            jsonBody(req, res, function (err, body) {

                const path = `./files/${body.filename}.txt`;
                fs.unlink(path, err => {
                    if (err) {
                        throw err;
                    } else {
                        res.writeHead(200);
                        res.end(`Вы авторизованы, поэтому файл успешно удален`);
                    };

                });
            })
        } else {
            res.writeHead(400);
            res.end(`Вы не авторизованы`);
        }
    }

})
app.all('/post', function (req, res, next) {
    if (req.method !== 'POST') {
        res.writeHead(405);
        res.end('HTTP method not allowed.');
    } else {
        const cookies = cookie.parse(req.headers.cookie || '');
        if (cookies.authorized === "true" && cookies.userId == `${user.id}`) {
            jsonBody(req, res, function (err, body) {

                const path = `./files/${body.filename}.txt`;
                fs.writeFile(path, body.content, (err) => {
                    if (err)
                        console.log(err);
                    else {
                        res.writeHead(200);
                        res.end(`Вы авторизованы, поэтому файл успешно записан`);
                    }
                });
            })
        } else {
            res.writeHead(400);
            res.end(`Вы не авторизованы`);
        }
    }
})
app.all('/redirect', function (req, res, next) {
    if (req.method !== 'GET') {
        res.writeHead(405);
        res.end('HTTP method not allowed.');
    } else {
        res.writeHead(200);
        mainAdress = '/redirected';
        res.end(`ресурс теперь постоянно доступен по адресу ${mainAdress}`);
    }

})
app.all('/auth', function (req, res, next) {
    if (req.method !== 'POST') {
        res.writeHead(405);
        res.end('HTTP method not allowed.');
    } else {
        // console.log(req.body)
        jsonBody(req, res, function (err, body) {
            if (body.username == user.username && body.password == user.password) {
                const options = {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 2,
                    path: '/'
                }

                res.writeHead(200, {
                    'Set-Cookie': [
                        cookie.serialize('authorized', true, options),
                        cookie.serialize('userId', user.id, options)
                    ],
                });
                res.end(`Вы вошли в аккаунт`);
            } else {
                res.writeHead(400);
                res.end(`Неверный логин или пароль`);
            }
        })

        // res.end(`содержимое запроса: ${JSON.parse(req.body)}`)


    }

})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on port ${port}...`));