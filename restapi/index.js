require("dotenv").config();

const { v4: uuidv4 } = require("uuid"),
    http = require("http"),
    url_module = require("url");

const { host, port } = process.env;

const data = require("./data.json"),
    { handleItemID, deleteItemById, fsWriteFile } = require("./utils");


const my_server = http.createServer((req, res) => {
    const { url, method } = req,
        { query, pathname } = url_module.parse(url, true);

    if (method === "GET" && pathname === "/") {
        const { sort, id } = query;

        if (id) {
            let response_text =
                handleItemID(id, data) === "" ? "" : handleItemID(id, data);

            if (!response_text) {
                res.writeHead(329);
                res.end("Invalid id note");
            }

            res.writeHead(200);
            res.end(response_text);

            return;
        } else {
            const data_copy = [...data];

            if (sort) {
                switch (sort) {
                    case "upper":
                        data_copy.sort((a, b) =>
                            a.title.localeCompare(b.title)
                        );
                        break;
                    case "lower":
                        data_copy.sort((a, b) =>
                            b.title.localeCompare(a.title)
                        );
                        break;
                }
            }

            res.writeHead(200);
            res.end(JSON.stringify(data_copy));
        }
    } else if (method === "POST" && pathname === "/") {
        let body = [];

        req.on("data", (chunk) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            const dataJSON = JSON.parse(body),
                newID = uuidv4();

            data.push({ id: newID, ...dataJSON });

            const newDataJSON = JSON.stringify(data, null, 2);

            fsWriteFile(
                newDataJSON,
                res,
                "Data written to file successfully",
                JSON.stringify(newData)
            );
        });
    } else if (method === "DELETE" && pathname === "/") {
        const { id } = query;

        if (id) {
            if (deleteItemById(id, data)) {
                fsWriteFile(
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
            fsWriteFile(
                "",
                res,
                "Data file cleared successfully",
                "Item deleted successfully"
            );

            return;
        }
    } else if (method === "PUT" && pathname === "/edit") {
        const { id } = query;
        const body = [];

        if (id && handleItemID(id, data)) {
            req.on("data", (chunk) => {
                body.push(chunk);
            }).on("end", () => {
                const { title, message } = JSON.parse(
                    Buffer.concat(body).toString()
                );

                if (title || message) {
                    const newObject = {
                        id,
                        title,
                        message,
                    };

                    deleteItemById(id, data);
                    data.push(newObject);

                    const newDataJSON = JSON.stringify(data, null, 2);

                    fsWriteFile(
                        newDataJSON,
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
    }
});

my_server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
