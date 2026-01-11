const express = require("express");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const { sneakers, users, reviews, sync, param, paramReviews } = require("../data/information");
const { checkAuth } = require("../middleware/authMiddlewear");
const privateController = require("../controllers/privateController");
const mainController = require("../controllers/mainController");

const usersPath = path.join(__dirname, "../data/json/users.json");

const reviewsPath = path.join(__dirname, "../data/json/reviews.json");

const privateRouter = express.Router();
exports.privateRouter = privateRouter;

privateRouter.use(checkAuth);

privateRouter.get("/username", (req, res) =>
  res.json({
    username: req.session.username || "Пользователь не представлялся",
    cart: req.session.cart,
  })
);

privateRouter.get("/", mainController.getNine);

privateRouter.get("/katalog", mainController.getAll);

privateRouter.get("/basket", privateController.basket);

privateRouter.post("/basket/confirm", privateController.confirm);

privateRouter.get("/product", mainController.product);

privateRouter.delete('/basket/delete/:productId', privateController.delete);

privateRouter.put('/basket/plus/:productId', privateController.plus);

privateRouter.put('/basket/minus/:productId', privateController.minus);



privateRouter.post("/add-to-cart", privateController.add);

privateRouter.get("/reviews", mainController.reviews);

privateRouter.post("/reviews/adding", privateController.addReview);

privateRouter.get("/logout", privateController.logout);

module.exports = privateRouter;
