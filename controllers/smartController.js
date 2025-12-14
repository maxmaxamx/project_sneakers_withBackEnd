const url = require("url");
const path = require("path");
const { sneakers, users } = require("../data/information")

function validateCredentials(username, password) {
  for(let i = 0; i < users.length; i++){
    if(users[i].username == username && users[i].password == password)
        return true;
    else
        return false;
  }
}

module.exports = validateCredentials;