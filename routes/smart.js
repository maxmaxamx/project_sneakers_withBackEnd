const url = require("url");
const path = require("path");
const formidable = require("formidable");
const { sneakers, users, reviews, param, validateCredentials, checkExistion, register } = require("../data/information")
const express = require("express");
const bcrypt = require("bcrypt");
const { checkNonAuth } = require("../middleware/authMiddlewear")

const router = express.Router();
exports.router = router;


router.get("/", checkNonAuth, (req, res) => {
  let sneaker = sneakers.slice(0, 9);
  res.render("index.hbs", { sneakers: sneaker });
});

router.get("/basket",checkNonAuth, (req, res) => {
  res.render("basket.hbs", { auth: false });
});

router.get("/katalog",checkNonAuth, (req, res) => {
  const { sort, minprice, maxprice , find} = req.query;
  let filtered = param(sort, minprice, maxprice, find);

  res.render("katalog.hbs", { sneakers: filtered, minprice: minprice || '', maxprice: maxprice || '', find: find || ''});
});

router.get("/log", checkNonAuth, (req, res) => {
  res.render("login.hbs");
});

router.get("/reg", checkNonAuth, (req, res) => {
  res.render("register.hbs");
});

router.get("/product", checkNonAuth, (req, res) => {
  id = req.query.id;

  res.render("product.hbs",
    {
      title: sneakers[id].title,
      price: sneakers[id].price,
      image: sneakers[id].image,
    }
  );
});

router.get("/reviews",checkNonAuth, (req,res) => {
  res.render("reviews.hbs", {reviews: reviews} );
});

router.post("/login",checkNonAuth, (req, res) => {
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

router.post("/reg", checkNonAuth, (req, res) => {
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