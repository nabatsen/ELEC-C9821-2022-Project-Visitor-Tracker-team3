const http = require("http");
// const statistic = require("./data/statistic");
const {
  getStats,
  getStat,
  createStat,
  updateStat,
  deleteStat,
} = require("./controller/statController");

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/html");
//   res.write("<h1>Hi from Team 3</h1>");
//   res.end();
// });
const server = http.createServer((req, res) => {
  if (req.url === "/api/statistic" && req.method === "GET") {
    getStats(req, res);
  } else if (req.url.match(/\/api\/statistic\/\w+/) && req.method === "GET") {
    const id = req.url.split("/")[3];
    getStat(req, res, id);
  } else if (req.url === "/api/statistic" && req.method === "POST") {
    createStat(req, res);
  } else if (req.url.match(/\/api\/statistic\/\w+/) && req.method === "PUT") {
    const id = req.url.split("/")[3];
    updateStat(req, res, id);
  } else if (
    req.url.match(/\/api\/statistic\/\w+/) &&
    req.method === "DELETE"
  ) {
    const id = req.url.split("/")[3];
    deleteStat(req, res, id);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Undefined" }));
  }
});

const PORT = process.env.PORT || 3000; // check if environment variable or use 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = server;
