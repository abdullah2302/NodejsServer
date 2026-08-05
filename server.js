const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const os = require("os");

const logFilePath = path.join(__dirname, "log.log");

const server = http.createServer((req, res) => {


    if (req.method === "GET" && req.url === "/") {

        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading page");
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

    }


    else if (req.method === "POST" && req.url === "/datasend") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            // Log the data entry
            const logEntry = `${new Date().toISOString()} - ${os.hostname()}\n`;
            fs.appendFileSync(logFilePath, logEntry);

            const formData = querystring.parse(body);


            const newEntry = {
                name: formData.name,
                email: formData.email,
                age: formData.age,
                gender: formData.gender,
                country: formData.country,
                city: formData.city
            };

            let jsonArray = [];

            // Read the existing JSON file if it exists
            if (fs.existsSync("data.json")) {
                const fileData = fs.readFileSync("data.json", "utf8");
                jsonArray = JSON.parse(fileData);
            }

        
            const existingEntry = jsonArray.find(item => item.email === newEntry.email);
            if (existingEntry) {
                res.writeHead(400, { "Content-Type": "text/html" });
                return res.end(`<h2>Error: User with email "${newEntry.email}" already exists!</h2><a href="/">Go Back</a>`);
            }

            //    if (fs.existsSync("data.json")) {
            //         const fileData = fs.readFileSync("data.json", "utf8").trim();

            //         if (fileData.length > 0) {
            //             jsonArray = JSON.parse(fileData);
            //         }
            //     }

            jsonArray.push(newEntry);


            fs.writeFileSync("data.json", JSON.stringify(jsonArray, null, 6));

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end("<h2>Data Saved Successfully! <a href='/'>Go Back</a></h2>");
        });

    }
    else if (req.method === "GET" && req.url === "/fetch") {
        const filePath = path.join(__dirname, "data.json");
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error reading data");
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(data);

        });

    }


    else if (req.method === "GET" && req.url === "/delete") {
        fs.readFile("delete.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading delete page");
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }


    else if (req.method === "POST" && req.url === "/delete-item") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            const formData = querystring.parse(body);
            const targetEmail = formData.email;

            let jsonArray = [];


            if (fs.existsSync("data.json")) {
                const fileData = fs.readFileSync("data.json", "utf8").trim();
                if (fileData.length > 0) {
                    jsonArray = JSON.parse(fileData);
                }
            }


            const updatedArray = jsonArray.filter(item => item.email !== targetEmail);


            if (jsonArray.length === updatedArray.length) {
                res.writeHead(400, { "Content-Type": "text/html" });
                return res.end(`<h2>Error: User with email "${targetEmail}" does not exist or has already been deleted!</h2><a href="/delete">Go Back</a>`);
            }

            // Overwrite database with updated array
            fs.writeFileSync("data.json", JSON.stringify(updatedArray, null, 2));

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(`<h2>Successfully removed entries for: ${targetEmail}</h2><a href="/">Go Back</a>`);
        });
    }

    else if (req.method === "GET" && req.url === "/edit") {
        fs.readFile("edit.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading edit page");
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        }
        );
    }


    else if (req.method === "POST" && req.url === "/edit-item") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            const formData = querystring.parse(body);
            const targetEmail = formData.email;
            const newName = formData.name;
            const newAge = formData.age;
            const newGender = formData.gender;
            const newCountry = formData.country;
            const newCity = formData.city;

            let jsonArray = [];

            if (fs.existsSync("data.json")) {
                const fileData = fs.readFileSync("data.json", "utf8").trim();

                if (fileData.length > 0) {
                    jsonArray = JSON.parse(fileData);
                }

            }

            const entryIndex = jsonArray.findIndex(item => item.email === targetEmail);

            if (entryIndex === -1) {
                res.writeHead(400, { "Content-Type": "text/html" });
                return res.end(`<h2>Error: User with email "${targetEmail}" does not exist!</h2><a href="/edit">Go Back</a>`);
            }

            jsonArray[entryIndex].name = newName;

            fs.writeFileSync("data.json", JSON.stringify(jsonArray, null, 2));

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(`<h2>Successfully updated entry for: ${targetEmail}</h2><a href="/">Go Back</a>`);

        });

    }

    else if (req.method === "GET" && req.url === "/style.css") {

        fs.readFile(path.join(__dirname, "style.css"), (err, data) => {

            if (err) {
                res.writeHead(404);
                return res.end("CSS file not found");
            }
            res.writeHead(200, {
                "Content-Type": "text/css"
            });

            res.end(data);
        });

    }
    else if (req.method === "GET" && req.url === "/about") {
        fs.readFile("about.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading about page");
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }
    else if (req.method === "GET" && req.url === "/script.js") {

        fs.readFile("script.js", "utf8", (err, data) => {

            if (err) {
                res.writeHead(404);
                return res.end("Script not found");
            }

            res.writeHead(200, {
                "Content-Type": "application/javascript"
            });

            res.end(data);
        });

    }
    else if( req.method === "GET" && req.url === "/favicon-96x96.png") {
        fs.readFile("favicon-96x96.png", (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Favicon not found");
            }
            res.writeHead(200, {
                "Content-Type": "image/png"
            });
            res.end(data);
        });
    }
    else if(req.method === "GET" && req.url === "/favicon.ico") {
        fs.readFile("favicon-96x96.png", (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Favicon not found");
            }
            res.writeHead(200, {
                "Content-Type": "image/png"
            });
            res.end(data);
        });
    }
    else {
        res.writeHead(404);
        res.end("Page Not Found");
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
