require("dotenv").config();

const winston = require("winston"),
  chalk = require("chalk"),
  { v4: uuidv4 } = require("uuid"),
  http = require("http"),
  url_module = require('url');

const host = process.env.HOST,
  port = process.env.PORT;

const server = http.createServer((req, res) => {
    const parsedURL = url_module.parse(req.url, true)

    const {headers, method, url} = req,
        {pathname, query} =  parsedURL;

    console.log(query.id)
    
    if(method === 'GET' && pathname === '/'){

        if(Object.keys(query).includes('sort') && Object.keys(query).length === 1){

            let response_text = '';

            switch(query.sort){
                case 'up':
                    response_text = 'Lower to upper sorting';
                    break;
                case 'down':
                    response_text = 'Upper to lower sorting';
                    break;
                default:
                    response_text = 'Invalid sorting type';
                    break; 
            }

            res.writeHead(200);
            res.end(response_text);

            return;
        }else{
            res.writeHead(429);
            res.end('Invalid length of query');

            return;
        }

        res.writeHead(200);
        res.end('No sort');
    }else if (method === 'POST' && pathname === '/'){
        let body = [];

        req.
            on('data', (chunk) => {
                body.push(chunk)
            })
            .on('end', () => {
                body = Buffer.concat(body).toString();
                console.log(body)
                res.end(body)
            })
    } else if(method === 'DELETE' && pathname === '/user'){
        if(Object.keys(query).includes('id') && Object.keys(query).length === 1){
            res.writeHead(200);
            res.end(query.id);

            return;
        }else{
            res.writeHead(429);
            res.end('Invalid delete router');

            return;
        }
    }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});






