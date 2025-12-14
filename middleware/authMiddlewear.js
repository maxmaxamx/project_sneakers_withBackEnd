const session = require("express-session");
const crypto = require("crypto");

//инициализация middleware для работы с сессией
const authInit = () =>
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: true,
    saveUninitialized: true,
  });

const checkAuth = (req, res, next) => {
  if (!req.session.auth)
    return res.status(400).json({ message: "Вам сюда нельзя" });

  next();
};

module.exports = { authInit, checkAuth };