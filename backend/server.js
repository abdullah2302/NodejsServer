const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const url = require("url");
const os = require("os");

const logFilePath = path.join(__dirname, "log.log");
const dataFilePath = path.join(__dirname, "data.json");
const frontendPath = path.join(__dirname, "..", "frontend");
console.log(frontendPath);
// console.log(dataFilePath);



const server = http.createServer((req, res) => {


    if (req.method === "GET" && req.url === "/") {

        fs.readFile(path.join(frontendPath, "index.html"), (err, data) => {
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

        // Read existing data.json if it exists
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, "utf8").trim();

            if (fileData.length > 0) {
                jsonArray = JSON.parse(fileData);
            }
        }

        const existingEntry = jsonArray.find(item => item.email === newEntry.email);

        if (existingEntry) {
            res.writeHead(400, { "Content-Type": "text/html" });
            //read the datasend-error.html file and replace the placeholder with the actual email
            const errorPage =  fs.readFileSync(path.join(frontendPath, "datasend-error.html"), "utf8");
            const errorPageWithEmail = errorPage.replace("{{EMAIL}}", newEntry.email);
            return res.end(errorPageWithEmail);
        }


       
        jsonArray.push(newEntry);

        // This creates data.json in the backend folder if it doesn't exist
        fs.writeFileSync(dataFilePath, JSON.stringify(jsonArray, null, 2));

        res.writeHead(200, {
            "Content-Type": "text/html"
        });






    //read the datasend-success.html file and send it as a response
    const successPage = fs.readFileSync(path.join(frontendPath, "datasend-success.html"), "utf8");
    res.end(successPage);
    });
}
    else if (req.method === "GET" && req.url === "/fetch") {
        fs.readFile(dataFilePath, "utf8", (err, data) => {
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
        fs.readFile(path.join(frontendPath, "delete.html"), (err, data) => {
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


            if (fs.existsSync(dataFilePath)) {
                const fileData = fs.readFileSync(dataFilePath, "utf8").trim();
                if (fileData.length > 0) {
                    jsonArray = JSON.parse(fileData);
                }
            }


            const updatedArray = jsonArray.filter(item => item.email !== targetEmail);


            if (jsonArray.length === updatedArray.length) {
                res.writeHead(400, { "Content-Type": "text/html" });
                const errorPage = fs.readFileSync(path.join(frontendPath, "delete-error.html"), "utf8");
                return res.end(errorPage.replace("{{EMAIL}}", targetEmail));

            }

            // Overwrite database with updated array
            fs.writeFileSync(dataFilePath, JSON.stringify(updatedArray, null, 2));

            res.writeHead(200, {
                "Content-Type": "text/html"
            });
               
            const successPage = fs.readFileSync(path.join(frontendPath, "delete-success.html"), "utf8");
            res.end(successPage.replace("{{EMAIL}}", targetEmail));
        });
    }

    else if (req.method === "GET" && req.url === "/edit") {
        fs.readFile(path.join(frontendPath, "edit.html"), (err, data) => {
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
            const newEntry = {
                name: formData.name,
                age: formData.age,
                gender: formData.gender,
                country: formData.country,
                city: formData.city
            };

            let jsonArray = [];

            if (fs.existsSync(dataFilePath)) {
                const fileData = fs.readFileSync(dataFilePath, "utf8").trim();

                if (fileData.length > 0) {
                    jsonArray = JSON.parse(fileData);
                }

            }

            const entryIndex = jsonArray.findIndex(item => item.email === targetEmail);

            if (entryIndex === -1) {
                res.writeHead(400, { "Content-Type": "text/html" });
                const errorPage = fs.readFileSync(path.join(frontendPath, "edit-error.html"), "utf8");
                return res.end(errorPage.replace("{{EMAIL}}", targetEmail));
            }

            jsonArray[entryIndex] = { ...jsonArray[entryIndex], ...newEntry };
            fs.writeFileSync(dataFilePath, JSON.stringify(jsonArray, null, 2));

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            const successPage = fs.readFileSync(path.join(frontendPath, "edit-success.html"), "utf8");
            res.end(successPage.replace("{{EMAIL}}", targetEmail));

        });

    }

    else if (req.method === "GET" && req.url === "/search") {
        fs.readFile(path.join(frontendPath, "search.html"), (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading search page");
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(data);
        });
    }

    else if (req.method === "GET" && req.url.startsWith("/search-item")) {

        // 2. Parse the query parameters from the URL
        const parsedUrl = url.parse(req.url, true);
        const targetEmail = parsedUrl.query.email;

        let jsonArray = [];
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, "utf8").trim();
            if (fileData.length > 0) {
                jsonArray = JSON.parse(fileData);
            }
        }

        // 3. Search for the user in your database file
        const foundItem = jsonArray.find(item => item.email === targetEmail);

        if (!foundItem) {
            res.writeHead(404, { "Content-Type": "text/html" });
            const errorPage = fs.readFileSync(path.join(frontendPath, "search-notfound.html"), "utf8");
            return res.end(errorPage.replace("{{EMAIL}}", targetEmail));
        }

        // 4. Return the found user details
        res.writeHead(200, { "Content-Type": "text/html" });
        const resultPage = fs.readFileSync(path.join(frontendPath, "search-found.html"), "utf8");
        const resultPageWithDetails = resultPage.replace("{{NAME}}", foundItem.name)
            .replace("{{EMAIL}}", foundItem.email)
            .replace("{{AGE}}", foundItem.age)
            .replace("{{GENDER}}", foundItem.gender)
            .replace("{{COUNTRY}}", foundItem.country)
            .replace("{{CITY}}", foundItem.city);
        res.end(resultPageWithDetails);
    }


    else if (req.method === "GET" && req.url === "/style.css") {

        fs.readFile(path.join(frontendPath, "style.css"), (err, data) => {

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
        fs.readFile(path.join(frontendPath, "about.html"), (err, data) => {
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

        fs.readFile(path.join(frontendPath, "script.js"), "utf8", (err, data) => {

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
    else if (req.method === "GET" && req.url === "/favicon-96x96.png") {
        fs.readFile(path.join(frontendPath, "favicon-96x96.png"), (err, data) => {
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
    else if (req.method === "GET" && req.url === "/favicon.ico") {
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