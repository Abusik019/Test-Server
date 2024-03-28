require("dotenv").config();

const http = require("http"),
    url_module = require("url"),
    { v4: uuidv4 } = require("uuid");

const { findIndex, writeFile, handleItemID } = require("./utils");

const { host, port } = process.env;

const data = require("./data.json");

const server = http.createServer((req, res) => {
    const { method, url } = req,
        { pathname, query } = url_module.parse(url, true);

    if (method === "GET" && pathname === "/") {
        const { id, filter, sort, amount } = query;

        // get by id
        if (id) {
            const findIndex = data.findIndex((el) => el.id === +id);
            res.writeHead(200);
            res.end(JSON.stringify(data[findIndex]));
            return;
        }

        // Slice of data
        const copyData = [...data].slice(0, amount ? +amount + 1 : data.length);

        // sort
        if (sort === "upper") {
            copyData.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "lower") {
            copyData.sort((a, b) => b.name.localeCompare(a.name));
        }

        //filter
        switch (filter) {
            case "verify":
                res.writeHead(200);
                res.end(JSON.stringify(copyData.filter((el) => el.verify)));
                return;
            case "no_verify":
                res.writeHead(200);
                res.end(JSON.stringify(copyData.filter((el) => !el.verify)));
            case "full_data":
                res.writeHead(200);
                res.end(
                    JSON.stringify(
                        copyData.filter((el) => el.name && el.surname)
                    )
                );
            case "unfinished_data":
                res.writeHead(200);
                res.end(
                    JSON.stringify(
                        copyData.filter((el) => !el.name || !el.surname)
                    )
                );
        }

        if(query.street || query.city){
            res.writeHead(200);
            
            res.end(JSON.stringify(copyData.filter(user => {
                if(query.street !== undefined && query.city !== undefined){
                    return user.address?.street === query.street && user.address?.city === query.city
                }else if(query.street !== undefined){
                    return user.address?.street === query.street;
                }else if (user.address?.city !== undefined){
                    return user.address?.city === query.city;
                }else {
                    return false
                }
            })))

            return;
        }

        res.writeHead(200);
        res.end(JSON.stringify(copyData));


    } else if (method === "DELETE" && pathname === "/") {
        const { id } = query;

        if (id) {
            if (findIndex(data, id)) {
                writeFile(
                    JSON.stringify(data, null, 2),
                    res,
                    "Data written to file successfully",
                    "Data file cleared successfully"
                );
            } else {
                res.writeHead(404);
                res.end("Item not found");
            }
        } else {
            writeFile(
                JSON.stringify([]),
                res,
                "Data file cleared successfully",
                "Item deleted successfully"
            );
        }
    } else if (method === "PUT" && pathname === "/edit") {
        const { id } = query;
        const body = [];

        if (id) {
            req.on("data", (chunk) => {
                body.push(chunk);
            }).on("end", () => {
                const { name, surname } = JSON.parse(
                    Buffer.concat(body).toString()
                );

                if (name || surname) {
                    // const newUser = {
                    //     id: +id,
                    //     name: name ?? "",
                    //     surname: surname ? surname : "",
                    //     verify: false
                    // }

                    // findIndex(data, id)
                    // data.push(newUser)
                    // Надо исправить редактирование с использованием старых данных, если не передаются новые

                    writeFile(
                        JSON.stringify(data, null, 2),
                        res,
                        "Data file changed successfully",
                        "Data file changed successfully"
                    );
                } else {
                    res.writeHead(329);
                    res.end("Invalid data body");
                }
            });
        } else {
            res.writeHead(329);
            res.end("Invalid id note");
        }
    } else if (method === "PATCH" && pathname === "/") {
        if (query.id) {
            let body = [];

            req.on("data", (chunk) => {
                body.push(chunk);
            }).on("end", () => {
                body = Buffer.concat(body).toString();

                const { verify } = JSON.parse(body),
                    itemIndex = data.findIndex((el) => el.id === +query.id);

                if (itemIndex !== -1) {
                    if (verify !== undefined) {
                        data[itemIndex].verify = verify;
                    }

                    writeFile(
                        JSON.stringify(data, null, 2),
                        res,
                        "Data file changed successfully",
                        "Data file changed successfully"
                    );

                    res.writeHead(200);
                    res.end(JSON.stringify(data[itemIndex]));

                    return;
                }

                res.writeHead(204);
                res.end("Item not found");
            });
        } else {
            let body = [];

            req.on("data", (chunk) => {
                body.push(chunk);
            }).on("end", () => {
                body = Buffer.concat(body).toString();

                const { verify } = JSON.parse(body);

                data.forEach((item) => {
                    item.verify = verify;
                });

                writeFile(
                    JSON.stringify(data, null, 2),
                    res,
                    "Data file changed successfully",
                    "Data file changed successfully"
                );

                return;
            });
        }
    } else if (method === "POST" && pathname === "/") {
        let body = [];

        req.on("data", (chunk) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            const { name, surname } = JSON.parse(body);

            if (!name && !surname) {
                res.writeHead(329);
                res.end("Invalid data");
            }

            data.push(
                { 
                    id: uuidv4(), 
                    surname, 
                    name,
                    verify: false,
                }
            );

            writeFile(
                JSON.stringify(data, null, 2),
                res,
                "Data file changed successfully",
                "Data file changed successfully"
            );
        });
    }
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

// {
//     "id": 1001,
//     "name": "John",
//     "surname": "Smith",
//  },

//  {
//     "id": 1019,
//     "name": "Marry",
//     "surname": "Smith",
//     "link": 1018
//  },

// 1. Запрос на добавление пользователя через POST (передаются name, surname)

// 2. Запрос на получение всех пользователей по указанному адресе (город и улица)

// 3. Запрос на добавление адреса к пользователю, в таком случае формируется новое поле address с полями city, street, house number
// (если какие поля не указаны, то значение будет string - 'None')

// 4. Нужно добавить связи пользователей,
// К пользователю выбранному для уточнения связи добавляется поле link и указывается id второго пользователя для связи. У второго так же добавляется поле к первому.
// Если разорвали связь, то у второго она полностью удаляется
