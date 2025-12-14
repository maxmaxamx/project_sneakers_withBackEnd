const express = require("express");
const path = require("path");
const fs = require("fs");
const { sneakers, users } = require("../data/information");
const { checkAuth } = require("../middleware/authMiddlewear");

const usersPath = path.join(__dirname, "../data/json/users.json");

//сюда сможет зайти лишь тот, у кого корректные данные
const privateRouter = express.Router();

//middleware, который проверяет авторизацию
privateRouter.use(checkAuth);

privateRouter.use((req, res, next) => {
  res.locals.auth = !!req.session?.auth;

  const username = req.session.username;

  if (!req.session.cart) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].username == username) {
        req.session.cart = users[i].cart;
      }
    }
  }

  next();
});

privateRouter.get("/username", (req, res) =>
  res.json({
    username: req.session.username || "Пользователь не представлялся",
    cart: req.session.cart,
  })
);

privateRouter.get("/", (req, res) => {
  res.render("index.hbs", { sneakers: sneakers });
});

privateRouter.get("/katalog", (req, res) => {
  const { sort } = req.query;
  let filtered = [...sneakers];

  if (sort == "ascending") {
    res.render("katalog.hbs", {
      sneakers: filtered.sort((a, b) => a.price - b.price),
    });
  } else if (sort == "descending") {
    res.render("katalog.hbs", {
      sneakers: filtered.sort((a, b) => b.price - a.price),
    });
  } else {
    res.render("katalog.hbs", { sneakers: sneakers });
  }
});

privateRouter.get("/basket", (req, res) => {
  let total = 0;
  let totalPrice = 0;
  const fullCart = (req.session.cart || []).map((item) => {
    const product = sneakers.find((s) => s.id === item.id);
    totalPrice = product.price * item.quantity;
    total+=totalPrice;
    return {
      ...item,
      product,
      totalPrice,
    };
  });

  console.log(fullCart);

  res.render("basket", {
    cart: fullCart,
    total
  });
});

privateRouter.get("/product", (req, res) => {
  id = req.query.id;

  res.render("product.hbs", {
    title: sneakers[id].title,
    price: sneakers[id].price,
    image: sneakers[id].image,
  });
});

privateRouter.post("/add-to-cart", (req, res) => {
  const { id } = req.body;
  const productId = parseInt(id, 10);

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "ID товара не указан" });
  }

  let found = false;
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].id == productId) {
      req.session.cart[i].quantity += 1;
      found = true;
      break;
    }
  }

  if (!found) {
    req.session.cart.push({ id: productId, quantity: 1 });
  }

  for (let i = 0; i < users.length; i++) {
    if (users[i].username == req.session.username) {
      users[i].cart = req.session.cart;
    }
  }

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");

  res.json({
    success: true,
    message: "Товар добавлен в корзину",
    cart: req.session.cart,
  });
});
privateRouter.get("/logout", (req, res) => {
  req.session.auth = false;
  req.session.destroy((err) => {
    if (err) {
      console.error("Ошибка разрушения сессии:", err);
      return res.status(500).send("Ошибка сервера");
    }

    res.redirect("/");
  });
});

module.exports = privateRouter;
