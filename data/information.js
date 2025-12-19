const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const dataFromJSON = fs.readFileSync(
  path.join(__dirname, './json/sneakers.json'),
  'utf8'
);

const usersFromJSON = fs.readFileSync(
  path.join(__dirname, './json/users.json'),
  'utf8'
);

const usersPath = path.join(__dirname, "../data/json/users.json");

const sneakers = JSON.parse(dataFromJSON);
const users = JSON.parse(usersFromJSON)

async function validateCredentials(username, password) {
  const user = users.find(u => u.username === username);
  if (!user) {
    return false;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
}

function checkExistion(username){
  const lowerUsername = username.toLowerCase();
  for (let i = 0; i < users.length; i++) {
    if (users[i].username.toLowerCase() === lowerUsername) {
      return true; 
    }
  }
  return false; 
}

async function register(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username: username.toLowerCase(),
    password: hashedPassword,
    cart: []
  });

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
}

function sync(req) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == req.session.username) {
      users[i].cart = req.session.cart;
    }
  }

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
}

function param(sort, minprice, maxprice) {
  let filtered = [...sneakers];

  if (minprice !== undefined && minprice !== '' && !isNaN(minprice)) {
    let min = parseInt(minprice);
    filtered = filtered.filter(item => item.price >= min);
  }

  if (maxprice !== undefined && maxprice !== '' && !isNaN(maxprice)) {
    let max = parseInt(maxprice);
    filtered = filtered.filter(item => item.price <= max);
  }


  if (sort == "ascending") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort == "descending") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
}

module.exports = { sneakers, users, sync, param, validateCredentials, checkExistion, register };