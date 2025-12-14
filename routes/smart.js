const url = require("url");
const path = require("path");
const formidable = require("formidable");
const { sneakers, users } = require("../data/information")
const validateCredentials = require("../controllers/smartController");
const express = require("express");
const smartController = require("../controllers/smartController");

const router = express.Router();


router.get("/", (req,res) => {
    let sneaker = sneakers.slice(0,9);
    res.render("index.hbs", { sneakers: sneaker });
});

router.get("/basket", (req,res) => {
    res.render("basket.hbs", {auth: false});
});

router.get("/katalog", (req,res) => {
  const { sort } = req.query;
  let filtered = [...sneakers];

  if( sort == "ascending" ){ 
    res.render("katalog.hbs", { sneakers: filtered.sort((a, b) => a.price - b.price)});
  } else if ( sort == "descending" ) {
    res.render("katalog.hbs", { sneakers: filtered.sort((a, b) => b.price - a.price)});
  } else {
      res.render("katalog.hbs", { sneakers: sneakers});
  }
  
});

router.get("/log", (req,res) => {
    res.render("login.hbs");
});

router.get("/reg", (req,res) => {
    res.render("register.hbs");
});

router.get("/product", (req,res) => {
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

  form.parse(req, (err, fields) => {
    if (err) {
      console.error("Ошибка парсинга формы:", err);
      return res.status(500).json({ message: "Ошибка обработки данных" });
    }

    const { username, password } = fields;

    console.log(fields);


    if (!username || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    if (!validateCredentials(username, password)) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    req.session.auth = true;
    req.session.username = username;

     res.redirect("/auth/katalog")
  });
});

router.get('/debug-session', (req, res) => {
  console.log('Текущая сессия:', req.session);
  res.send('Проверьте консоль сервера');
});

module.exports = router;