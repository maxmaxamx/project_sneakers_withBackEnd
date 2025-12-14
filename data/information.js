const fs = require("fs");
const path = require("path");

const dataFromJSON = fs.readFileSync(
  path.join(__dirname, './json/sneakers.json'),
  'utf8'
);

const usersFromJSON = fs.readFileSync(
  path.join(__dirname, './json/users.json'),
  'utf8'
);

const sneakers = JSON.parse(dataFromJSON);
const users = JSON.parse(usersFromJSON)



module.exports = { sneakers, users };