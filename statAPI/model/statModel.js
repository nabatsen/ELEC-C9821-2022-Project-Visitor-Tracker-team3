let statistics = require("../data/statistic");

const { writeDataToFile } = require("../utils");


function find(id, startdate=undefined, enddate=undefined) {
  return new Promise((resolve, reject) => {
    if(!(id in statistics))
      reject(new Error("No device with such ID"));
    else {
      stats = statistics[id];
      
      if(startdate != undefined) {
        stats.filter(stat => stat.date >= startdate)
      }
      if(enddate != undefined) {
        stats.filter(stat => stat.date <= enddate)
      }

      resolve(stats);
    }
  });
}

function put(id, stat) {
  return new Promise((resolve, reject) => {
    if(!(id in statistics))
      statistics[id] = [stat];
    else {
      const i = statistics[id].findIndex((e) => e.date === stat.date);
      if(i  == -1)
        statistics[id].push(stat)
      else
        statistics[id][i] = stat
    }

    if (process.env.NODE_ENV !== "test") {
      writeDataToFile("./data/statistic.json", statistics);
    }
    resolve();
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    if(!(id in statistics))
      reject(new Error("No device with such ID"));
    else {
      delete statistics[id]

      if (process.env.NODE_ENV !== "test") {
        writeDataToFile("./data/statistic.json", statistics);
      }
      resolve(id);
    }
  });
}

module.exports = {
  find,
  put,
  remove,
};
