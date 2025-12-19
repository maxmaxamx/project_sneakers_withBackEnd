const url = require("url");
const path = require("path");
const formidable = require("formidable");
const { sneakers, users, param, validateCredentials, checkExistion, register } = require("../data/information")
const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();


router.get("/", (req, res) => {
  let sneaker = sneakers.slice(0, 9);
  res.render("index.hbs", { sneakers: sneaker });
});

router.get("/basket", (req, res) => {
  res.render("basket.hbs", { auth: false });
});

router.get("/katalog", (req, res) => {
  const { sort, minprice, maxprice } = req.query;
  let filtered = param(sort, minprice, maxprice);

  res.render("katalog.hbs", { sneakers: filtered, minprice: minprice || '', maxprice: maxprice || '' });
});

router.get("/log", (req, res) => {
  res.render("login.hbs");
});

router.get("/reg", (req, res) => {
  res.render("register.hbs");
});

router.get("/product", (req, res) => {
  id = req.query.id;

  res.render("product.hbs",
    {
      title: sneakers[id].title,
      price: sneakers[id].price,
      image: sneakers[id].image,
    }
  );
});

router.post("/login", (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, async(err, fields) => {
    if (err) {
      console.error("Ошибка парсинга формы:", err);
      return res.status(500).json({ message: "Ошибка обработки данных" });
    }

    const { username, password } = fields;

    console.log(fields);


    if (!username || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const isValid = await validateCredentials(username, password);

    if (isValid) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    req.session.auth = true;
    req.session.username = username;

    res.redirect("/auth/katalog")
  });
});

router.post("/reg", (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, async(err, fields) => {
    if (err) {
      console.error("Ошибка парсинга формы:", err);
      return res.status(500).json({ message: "Ошибка обработки данных" });
    }

    const { username, password } = fields;

    console.log(fields);
    console.log(username[0]);

    if (!username || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    if (checkExistion(username[0])) {
      return res.status(409).json({ message: "такой пользователь уже существует" });
    }

    await register(username[0], password[0]);

    req.session.auth = true;
    req.session.username = username[0];

    res.redirect("/auth/katalog")
  });
});

module.exports = router;