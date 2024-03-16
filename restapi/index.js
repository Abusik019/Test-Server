// Надо написать api сервер для получения, создания и удаления записей.
// 1. Получение всех записей или одной по id ( передавать по query );
// 2. Добавление через post, поля title, message. Id присваивается на стороне сервера
// 3. Удаление всех записей или одной по id ( передавать по query )

// Model of note: {id, title, message}
require("dotenv").config();

const   { v4: uuidv4 } = require("uuid"),
        http = require("http"),
        url_module = require("url"),
        fs = require('fs'),
        chalk = require('chalk');

const   host = process.env.HOST,
        port = process.env.PORT;

const data = require('./data.json');

const my_server = http.createServer((req, res) => {
    const parsedURL = url_module.parse(req.url, true),
        { url, method, headers } = req,
        { query, pathname } = parsedURL;

    
    if(method === 'GET' && pathname === '/'){


        fs.readFile('./data.json', (err, data) => {
            if (err) {
                console.error('Data not read:', err);
                res.writeHead(500);
                res.end(chalk.bgRedBright('Internal Server Error'));
            } else {
                console.log(chalk.bgGreenBright('Data read successfully'));
                res.writeHead(200);
            }
        })

        res.writeHead(200)
        res.end('GET')
    } else if(method === 'POST' && pathname === '/'){
        let body = [];

        req.on('data', (data) => {
            body.push(data);
        })
        .on('end', () => {
            body = Buffer.concat(body).toString();
            const   dataJSON = JSON.parse(body),
                    newID = uuidv4(),
                    newData = {id: newID, ...dataJSON};

            data.push(newData);

            const newDataJSON = JSON.stringify(data, null, 2);
    
            fs.writeFile('./data.json', newDataJSON, (err) => {
                if (err) {
                    console.error(chalk.bgRedBright('Error writing to data file:'), chalk.red(err));
                    res.writeHead(500);
                    res.end('Internal Server Error');
                } else {
                    console.log(chalk.bgGreenBright('Data written to file successfully'));
                    res.writeHead(200);
                    res.end(JSON.stringify(newData));
                }
            })
        })
    } else if(method === 'DELETE' && pathname === '/'){


        res.writeHead(200)
        res.end('DELETE')
    }
});

my_server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})
