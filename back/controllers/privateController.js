const { User, CartItem, Image, Review, Admin, Sneaker, Order } = require("../models");
const { users, reviews, param, validateCredentials, checkExistion, register } = require("../data/information");
const { syncCartToDatabase } = require("../utils/sync")
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const fs = require("fs");


exports.basket = async (req, res) => {
    let total = 0;

    const sneakerInstances = await Sneaker.findAll({
        include: [{
            model: Image,
            as: "images",
            attributes: ["src"]
        }]
    });

    const sneakers = sneakerInstances.map(sneaker => ({
        id: sneaker.id,
        title: sneaker.title,
        price: sneaker.price,
        description: sneaker.description,
        image: (sneaker.images || []).map(img => img.src)
    }));

    if (req.session.cart) {
        const fullCart = req.session.cart
            .map((item) => {
                const product = sneakers.find((s) => s.id == item.id);
                if (!product) return null;
                console.log(item, " = = item");
                const totalPrice = product.price * item.quantity;
                total += totalPrice;
                return {
                    ...item,
                    product,
                    totalPrice,
                };
            })
            .filter(Boolean);

        res.render("basket", { cart: fullCart, total });
    } else {
        res.render("basket");
    }
};

exports.delete = async (req, res) => {
    let id = parseInt(req.params.productId);
    const user = await User.findOne({ where: { username: req.session.username } });

    let deletingProduct = req.session.cart.findIndex(item => item.id == id);

    req.session.cart.splice(deletingProduct, 1);

    syncCartToDatabase(user.id, req.session.cart);

    res.json({ success: true, cart: req.session.cart });
}

exports.plus = async (req, res) => {
    let id = parseInt(req.params.productId);
    const user = await User.findOne({ where: { username: req.session.username } });

    let plusProduct = req.session.cart.findIndex(item => item.id == id);

    req.session.cart[plusProduct].quantity += 1;

    syncCartToDatabase(user.id, req.session.cart);

    res.json({ success: true, cart: req.session.cart });
}

exports.minus = async (req, res) => {
    let id = parseInt(req.params.productId);
    const user = await User.findOne({ where: { username: req.session.username } });

    let minusProduct = req.session.cart.findIndex(item => item.id == id);

    if (req.session.cart[minusProduct].quantity == 1)
        req.session.cart.splice(minusProduct, 1);
    else
        req.session.cart[minusProduct].quantity -= 1;

    syncCartToDatabase(user.id, req.session.cart);


    res.json({ success: true, cart: req.session.cart });
}

exports.add = async (req, res) => {
    const user = await User.findOne({ where: { username: req.session.username } });
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

    syncCartToDatabase(user.id, req.session.cart);

    res.json({
        success: true,
        message: "Товар добавлен в корзину",
        cart: req.session.cart,
    });
}

exports.confirm = async (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
        if (err) {
            console.error("Ошибка парсинга формы:", err);
            return res.status(500).json({ message: "Ошибка обработки данных" });
        }

        const { phone, address } = fields;

        if (!phone || !address) {
            return res.status(400).json({ message: "Email и адрес обязательны" });
        }


        for (let i = 0; i < req.session.cart.length; i++) {
            if (typeof req.session.cart[i].id !== 'number' || req.session.cart[i].id <= 0) {
                console.error("Некорректный ID товара:", req.session.cart[i].id);
            }
            await Order.create({
                username: req.session.username,
                productId: req.session.cart[i].id,
                quantity: req.session.cart[i].quantity,
                address: address[0],
                phone: phone[0]
            });
        }

        req.session.cart = [];
        const user = await User.findOne({ where: { username: req.session.username } });
        syncCartToDatabase(user.id, req.session.cart);
        req.session.message = 'Заказ успешно оформлен!';
        res.redirect("/auth/katalog");
    });
}

exports.addReview = async (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
        if (err) {
            console.error("Ошибка парсинга формы:", err);
            return res.status(500).json({ message: "Ошибка обработки данных" });
        }

        const { review } = fields;

        await Review.create({
            author: req.session.username,
            text: review[0]
        });


        res.redirect("/auth/reviews");
    });
}

exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/');
    });
}