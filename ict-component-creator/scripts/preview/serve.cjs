const { createServer } = require("http");
const { readFile, stat } = require("fs").promises;
const { join, extname } = require("path");

const PORT = 3000;
const DIR = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    let url = req.url.split("?")[0];
    if (url === "/") url = "/index.html";

    const filePath = join(DIR, decodeURIComponent(url));
    if (!(await stat(filePath))) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500: " + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`Preview server: http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop.");
});
