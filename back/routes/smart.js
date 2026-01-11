const express = require("express");
const { checkNonAuth } = require("../middleware/authMiddlewear")
const mainController = require("../controllers/mainController")

const router = express.Router();
exports.router = router;

router.get("/", checkNonAuth ,mainController.getNine);

router.get("/basket", checkNonAuth, (req, res) => {
  res.render("basket.hbs", { auth: false });
});

router.get("/katalog", checkNonAuth, mainController.getAll);

router.get("/log", checkNonAuth, (req, res) => {
  res.render("login.hbs");
});

router.get("/reg", checkNonAuth, (req, res) => {
  res.render("register.hbs");
});

router.get("/product", checkNonAuth, mainController.product);

router.get("/reviews", checkNonAuth, mainController.reviews);

router.post("/login", checkNonAuth, mainController.logIn);

router.post("/reg", checkNonAuth, mainController.register);

module.exports = router;