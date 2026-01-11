const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const formidable = require("formidable");
const { checkAuth } = require("../middleware/authMiddlewear");
const { checkAdmin } = require("../middleware/authMiddlewear");
const mainController = require("../controllers/mainController");
const adminController = require("../controllers/adminController");

const sneakersPath = path.join(__dirname, "../data/json/sneakers.json");

const adminRouter = express.Router();
exports.adminRouter = adminRouter;

adminRouter.use(checkAdmin);

adminRouter.use((req, res, next) => {
    res.locals.admin = true;
    next();
});

adminRouter.get("/", adminController.adminPage);

adminRouter.delete('/delete/:productId', adminController.delete);

adminRouter.get("/katalog", mainController.getAll);

adminRouter.get("/product", mainController.product);

adminRouter.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/');
    });
});

adminRouter.get("/reviews", mainController.reviews);

adminRouter.post("/add", adminController.addSneaker);

module.exports = adminRouter;