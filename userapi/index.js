require("dotenv").config();

const http = require("http"),
    url_module = require("url");

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
            default:
                res.writeHead(200);
                res.end(JSON.stringify(copyData));
        }
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
        const body = []

        if(id){
            req.on("data", (chunk) => {
                body.push(chunk)
            }).on("end", () => {
                const { name, surname } = JSON.parse(
                    Buffer.concat(body).toString()
                );

                if(name || surname){
                    const newUser = { 
                        id: +id, 
                        name: name ? name : "", 
                        surname: surname ? surname : "",
                        verify: false
                    }
                    
                    findIndex(data, id)
                    data.push(newUser)

                    const newData = JSON.stringify(data, null, 2)
        
                    writeFile(
                        newData,
                        res,
                        "Data file changed successfully",
                        "Data file changed successfully"
                    );
                } else {
                    res.writeHead(329);
                    res.end("Invalid data body");
                }
            })
        }else {
            res.writeHead(329);
            res.end("Invalid id note");
        }
    } else if (method === "PATCH" && pathname === "/") {
        const { id } = query;

        if (id) {
            let body = [];
    
            req.on("data", (chunk) => {
                body.push(chunk);
            }).on("end", () => {
                body = Buffer.concat(body).toString();
    
                const { verify } = JSON.parse(body);
                
                const itemIndex = data.findIndex((el) => el.id === +id);

                if (itemIndex !== -1) {
                    if (verify !== undefined) {
                        data[itemIndex].verify = verify;
                    }

                    const newData = JSON.stringify(data, null, 2);
            
                    writeFile(
                        newData,
                        res,
                        "Data file changed successfully",
                        "Data file changed successfully"
                    );
                } else {
                    res.writeHead(404);
                    res.end("Item not found");
                }
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

                const newJSONData = JSON.stringify(data, null, 2);
        
                writeFile(
                    newJSONData,
                    res,
                    "Data file changed successfully",
                    "Data file changed successfully"
                );

                return
            });
        }
    }
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});