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

const adminsFromJSON = fs.readFileSync(
  path.join(__dirname, './json/admins.json'),
  'utf-8'
)

const reviewsFromJSON = fs.readFileSync(
  path.join(__dirname, './json/reviews.json'),
  'utf8'
);

const usersPath = path.join(__dirname, "../data/json/users.json");
const admins = JSON.parse(adminsFromJSON);
const sneakers = JSON.parse(dataFromJSON);
const users = JSON.parse(usersFromJSON)
const reviews = JSON.parse(reviewsFromJSON);

async function validateCredentials(username, password) {
  let role = null;
  let account = users.find(u => u.username === username);
  if (account) {
    role = "user";
  } else if (!account) {
    account = admins.find(a => a.username === username);
    if (account)
      role = "admin";
  }
  if (!account) {
    return false;
  }
  const isMatch = await bcrypt.compare(password, account.password);
  if (isMatch) {
    return role;
  } else {
    return false;
  }
}

function checkExistion(username) {
  const lowerUsername = username.toLowerCase();
  for (let i = 0; i < users.length; i++) {
    if (users[i].username.toLowerCase() === lowerUsername) {
      return true;
    }
  }
  return false;
}


function sync(req) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == req.session.username) {
      users[i].cart = req.session.cart;
    }
  }

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
}

function param(sort, minprice, maxprice, find) {
  let filtered = [...sneakers];

  if (minprice !== undefined && minprice !== '' && !isNaN(minprice)) {
    let min = parseInt(minprice);
    filtered = filtered.filter(item => item.price >= min);
  }

  if (maxprice !== undefined && maxprice !== '' && !isNaN(maxprice)) {
    let max = parseInt(maxprice);
    filtered = filtered.filter(item => item.price <= max);
  }

  if (find !== undefined && find !== '') {
    filtered = filtered.filter(item => item.title.toLowerCase().includes(find.toLowerCase()));
  }


  if (sort == "ascending") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort == "descending") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
}


module.exports = { sneakers, users, reviews, sync, param, validateCredentials, checkExistion};