const Statistic = require("../model/statModel");

const { getPostData } = require("../utils");

// @desc    Gets All stats
// @route   GET /api/stats
async function getStats(req, res) {
  try {
    const stats = await Statistic.findAll();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(stats));
  } catch (error) {
    console.log(error);
  }
}

// @desc    Gets Single stat
// @route   GET /api/stat/:id
async function getStat(req, res, id) {
  try {
    const stat = await Statistic.findById(id);

    if (!stat) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Statistic Not Found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(stat));
    }
  } catch (error) {
    console.log(error);
  }
}

// @desc    Create a stat
// @route   POST /api/stats
async function createStat(req, res) {
  try {
    const body = await getPostData(req);

    const { date, visitors } = JSON.parse(body);

    const stat = {
      date,
      visitors,
    };

    const newStat = await Statistic.create(stat);

    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(newStat));
  } catch (error) {
    console.log(error);
  }
}

// @desc    Update a stat
// @route   PUT /api/stats/:id
async function updateStat(req, res, id) {
  try {
    const stat = await Statistic.findById(id);

    if (!stat) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "stat Not Found" }));
    } else {
      const body = await getPostData(req);

      const { date, visitors } = JSON.parse(body);

      const statData = {
        date: date || stat.date,
        visitors: visitors || stat.visitors,
      };

      const updStat = await Statistic.update(id, statData);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(updStat));
    }
  } catch (error) {
    console.log(error);
  }
}

// @desc    Delete Product
// @route   DELETE /api/product/:id
async function deleteStat(req, res, id) {
  try {
    const stat = await Statistic.findById(id);

    if (!stat) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Statistic Not Found" }));
    } else {
      await Statistic.remove(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `Statistic ${id} removed` }));
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getStats,
  getStat,
  createStat,
  updateStat,
  deleteStat,
};
