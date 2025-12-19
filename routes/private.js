const express = require("express");
const path = require("path");
const fs = require("fs");
const { sneakers, users, sync, param } = require("../data/information");
const { checkAuth } = require("../middleware/authMiddlewear");

const usersPath = path.join(__dirname, "../data/json/users.json");

//сюда сможет зайти лишь тот, у кого корректные данные
const privateRouter = express.Router();
exports.privateRouter = privateRouter;

//middleware, который проверяет авторизацию
privateRouter.use(checkAuth);

privateRouter.use((req, res, next) => {
  res.locals.auth = !!req.session?.auth;

  const username = req.session.username;

  if (!req.session.cart) {
    for (let i = 0; i < users.length; i++) {
      if(users[i].username == username){
        req.session.cart = users[i].cart;
      }
    }
    
  }

  if (!req.session.cart) {
    req.session.cart = [];
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
  const { sort, minprice, maxprice } = req.query;
  let filtered = param(sort, minprice, maxprice);

  res.render("katalog.hbs", { sneakers: filtered, minprice: minprice || '', maxprice: maxprice || '' });

});

privateRouter.get("/basket", (req, res) => {
  let total = 0;
  let totalPrice = 0;


  if (req.session.cart) {
    const fullCart = req.session.cart.map((item) => {
      const product = sneakers.find((s) => s.id === item.id);
      totalPrice = product.price * item.quantity;
      total += totalPrice;
      return {
        ...item,
        product,
        totalPrice,
      };
    });

    res.render("basket", {
      cart: fullCart,
      total
    });
  } else {
    res.render("basket");
  }

});

privateRouter.get("/product", (req, res) => {
  id = req.query.id;

  res.render("product.hbs", {
    title: sneakers[id].title,
    price: sneakers[id].price,
    image: sneakers[id].image,
  });
});

privateRouter.delete('/basket/delete/:productId', (req, res) => {
  let id = parseInt(req.params.productId);

  let deletingProduct = req.session.cart.findIndex(item => item.id == id);

  req.session.cart.splice(deletingProduct, 1);

  sync(req);

  res.json({ success: true, cart: req.session.cart });
});

privateRouter.put('/basket/plus/:productId', (req, res) => {
  let id = parseInt(req.params.productId);

  let plusProduct = req.session.cart.findIndex(item => item.id == id);

  req.session.cart[plusProduct].quantity += 1;

  sync(req);

  res.json({ success: true, cart: req.session.cart });
});

privateRouter.put('/basket/minus/:productId', (req, res) => {
  let id = parseInt(req.params.productId);

  let minusProduct = req.session.cart.findIndex(item => item.id == id);

  if (req.session.cart[minusProduct].quantity == 1)
    req.session.cart.splice(minusProduct, 1);
  else
    req.session.cart[minusProduct].quantity -= 1;

  sync(req);

  res.json({ success: true, cart: req.session.cart });
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

  if (req.session.cart) {
    for (let i = 0; i < req.session.cart.length; i++) {
      if (req.session.cart[i].id == productId) {
        req.session.cart[i].quantity += 1;
        found = true;
        break;
      }
    }
  }


  if (!found) {
    req.session.cart.push({ id: productId, quantity: 1 });
  }

  sync(req);

  res.json({
    success: true,
    message: "Товар добавлен в корзину",
    cart: req.session.cart,
  });
});
privateRouter.get("/logout", (req, res) => {
  const { username } = req.session;
  if (username) {
    const user = users.find(u => u.username === username);
    if (user) {
      user.cart = [...req.session.cart];
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    }
  }
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

module.exports = privateRouter;
