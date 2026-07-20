const http = require("http");
const fs = require("fs");
const path = require("path");
const config = require("./config");

// Demo-only in-memory user store; never do this in production.
const users = { admin: "password123" };

function serveStatic(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    serveStatic(res, path.join(__dirname, "../frontend/index.html"), "text/html");
  } else if (req.method === "GET" && req.url === "/login.js") {
    serveStatic(res, path.join(__dirname, "../frontend/login.js"), "application/javascript");
  } else if (req.method === "GET" && req.url === "/style.css") {
    serveStatic(res, path.join(__dirname, "../frontend/style.css"), "text/css");
  } else if (req.method === "POST" && req.url === "/api/login") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let username, password;
      try {
        ({ username, password } = JSON.parse(body || "{}"));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid JSON body" }));
        return;
      }
      const ok = Boolean(users[username]) && users[username] === password;
      res.writeHead(ok ? 200 : 401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: ok }));
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

if (require.main === module) {
  server.listen(config.port, () => {
    console.log(`login-demo server listening on port ${config.port}`);
  });
}

module.exports = server;
