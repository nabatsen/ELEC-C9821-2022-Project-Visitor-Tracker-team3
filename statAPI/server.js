const http = require("http");
const url = require("url");

const {
  getStat,
  postStat,
  deleteDevice,
} = require("./controller/statController");

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url,true).pathname
  if (pathname === "/api/stat" && req.method === "GET") {
    getStat(req, res);
  } else if (pathname === "/api/stat" && req.method === "POST") {
    postStat(req, res);
  } else if (pathname === "/api/device" && req.method === "DELETE") {
    deleteDevice(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Undefined" }));
  }
});

const PORT = process.env.PORT || 3000; // check if environment variable or use 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = server;
