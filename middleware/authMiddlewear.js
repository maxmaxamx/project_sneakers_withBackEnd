const session = require("express-session");
const crypto = require("crypto");

const authInit = () =>
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Защита от XSS
      secure: process.env.NODE_ENV === "production", // Только HTTPS
      sameSite: "strict", // Защита от CSRF
    },
  });

const checkAuth = (req, res, next) => {
  if (req.session.auth == false)
    return res.status(400).json({ message: "Вам сюда нельзя" });

  next();
};

const checkNonAuth = (req, res, next) => {
  if (req.session.auth) {
    return res.status(400).json({ message: "Выйдите из аккаунта чтобы сюда попасть" });
  }

  next();
}

module.exports = { authInit, checkAuth, checkNonAuth };