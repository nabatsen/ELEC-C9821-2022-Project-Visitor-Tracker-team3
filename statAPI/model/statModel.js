let statistics = require("../data/statistic");
const { v4: uuidv4 } = require("uuid");

const { writeDataToFile } = require("../utils");

function findAll() {
  return new Promise((resolve, reject) => {
    resolve(statistics);
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    const stat = statistics.find((p) => p.id === id);
    resolve(stat);
  });
}

function create(stat) {
  return new Promise((resolve, reject) => {
    const newStat = { id: uuidv4(), ...stat };
    statistics.push(newStat);
    if (process.env.NODE_ENV !== "test") {
      writeDataToFile("./data/statistic.json", statistics);
    }
    resolve(newStat);
  });
}

function update(id, stat) {
  return new Promise((resolve, reject) => {
    const index = statistics.findIndex((p) => p.id === id);
    statistics[index] = { id, ...stat };
    if (process.env.NODE_ENV !== "test") {
      writeDataToFile("./data/statistic.json", statistics);
    }
    resolve(statistics[index]);
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    statistics = statistics.filter((p) => p.id !== id);
    if (process.env.NODE_ENV !== "test") {
      writeDataToFile("./data/statistic.json", statistics);
    }
    resolve();
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
