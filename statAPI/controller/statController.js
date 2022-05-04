const url = require('url');

const Statistic = require("../model/statModel");

const { getPostData } = require("../utils");

// @desc    Gets statistic for specific device id
// @route   GET /api/stat
async function getStat(req, res) {
  try {
    const query = url.parse(req.url, true).query

    const stat = await Statistic.find(query.id, query.startdate, query.enddate);

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

// @desc    Create (update) statistics for a day
// @route   POST /api/stat
async function postStat(req, res) {
  try {
    const {id} = url.parse(req.url, true).query
    const body = await getPostData(req);
    const { date, visitors } = JSON.parse(body);

    const stat = {
      date,
      visitors,
    };

    const newStat = await Statistic.put(id, stat);

    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(newStat));
  } catch (error) {
    console.log(error);
  }
}

// @desc    Delete device and all the date for it
// @route   DELETE /api/device
async function deleteDevice(req, res) {
  try {
    const {id} = url.parse(req.url, true).query

    Statistic.remove(id).then(
      (result) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: `Statistics for device ${id} removed` }));
      },
      (error) => {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: error.prototype.message }));
      }
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getStat,
  postStat,
  deleteDevice,
};
