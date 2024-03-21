require("dotenv").config();

const { v4: uuidv4 } = require("uuid"),
    http = require("http"),
    url_module = require("url"),
    fs = require("fs"),
    chalk = require("chalk");

const host = process.env.HOST,
    port = process.env.PORT;

const data = require("./data.json");

function handleItemID(queryID) {
    for (let item of data) {
        if (item.id === queryID) {
            return `${item.title}\n\n${item.message}`;
        }
    }

    return "";
}


function deleteItemById(id) {
	const index = data.findIndex((item) => item.id === id);
	if (index !== -1) {
		data.splice(index, 1);
		return true;
	}
	return false;
}

const my_server = http.createServer((req, res) => {
    const { url, method } = req,
        parsedURL = url_module.parse(url, true),
        { query, pathname } = parsedURL;

    if (method === "GET" && pathname === "/") {
        const { sort, id } = query;

        if (id) {
            console.log(handleItemID(id));
            let response_text = handleItemID(id) === "" ? "" : handleItemID(id);

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
                    case "upper": //по возрастанию
                        data_copy.sort((a, b) =>
                            a.title.localeCompare(b.title)
                        );
                        break;
                    case "lower": // по убыванию
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
                newID = uuidv4(),
                newData = { id: newID, ...dataJSON };

            data.push(newData);

            const newDataJSON = JSON.stringify(data, null, 2);

            fs.writeFile("./data.json", newDataJSON, (err) => {
                if (err) {
                    console.error(
                        chalk.bgRedBright("Error writing to data file:"),
                        chalk.red(err)
                    );
                    res.writeHead(500);
                    res.end("Internal Server Error");
                } else {
                    console.log(
                        chalk.bgGreenBright("Data written to file successfully")
                    );
                    res.writeHead(200);
                    res.end(JSON.stringify(newData));
                }
            });
        });
    } else if (method === "DELETE" && pathname === "/") {
        

        const { id } = query;

        if (id) {
            const itemDeleted = deleteItemById(id);
            if (itemDeleted) {
                const newDataJSON = JSON.stringify(data, null, 2);
                fs.writeFile("./data.json", newDataJSON, (err) => {
                    if (err) {
                        console.error(
                            chalk.bgRedBright("Error writing to data file:"),
                            chalk.red(err)
                        );

                        res.writeHead(500);
                        res.end("Internal Server Error");
                    } else {
                        console.log(
                            chalk.bgGreenBright(
                                "Data written to file successfully"
                            )
                        );

                        res.writeHead(200);
                        res.end("Item deleted successfully");
                    }
                });
            } else {
                res.writeHead(404);
                res.end("Item not found");
            }
        } else {
            fs.writeFile("./data.json", "", (err) => {
                if (err) {
                    console.error(
                        chalk.bgRedBright("Error writing to data file:"),
                        chalk.red(err)
                    );
                    res.writeHead(500);
                    res.end("Internal Server Error");
                } else {
                    console.log(
                        chalk.bgGreenBright("Data file cleared successfully")
                    );
                    res.writeHead(200);
                    res.end("Data file cleared successfully");
                }
            });

            return;
        }
    } else if (method === "PUT" && pathname === "/edit") {
        const { id } = query;
        const body = [];

        if (id && handleItemID(id)) {
            req.on("data", (chunk) => {
                body.push(chunk);
            }).on("end", () => {
                const { title, message } = JSON.parse(
                    Buffer.concat(body).toString()
                );

				if(title || message){
					const newObject = {
						id,
						title,
						message
					}

					deleteItemById(id);
					data.push(newObject);

                    const newDataJSON = JSON.stringify(data, null, 2);
                    
					fs.writeFile("./data.json", newDataJSON, (err) => {
						if (err) {
							console.error(
								chalk.bgRedBright("Error writing to data file:"),
								chalk.red(err)
							);
							res.writeHead(500);
							res.end("Internal Server Error");
						} else {
							console.log(
								chalk.bgGreenBright("Data file changed successfully")
							);
							res.writeHead(200);
							res.end("Data file changed successfully");
						}
					});
					
				}else{
					res.writeHead(329);
            		res.end("Invalid data body");
				}
            });
        }else{
			res.writeHead(329);
            res.end("Invalid id note");
		}
    }
});

my_server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

// Запрос на редактирование
// api route - put /edit?id
// @params: id
// Данные могут передаваться не все

// Не указала id
// Указали неверный id
// Указали id без данных
// Указали id с данными
