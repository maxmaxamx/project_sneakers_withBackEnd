const { User, CartItem, Image, Review, Admin, Sneaker } = require("../models");
const { sneakers, users, reviews, param, validateCredentials, checkExistion, register } = require("../data/information")
const bcrypt = require("bcrypt");
const formidable = require("formidable");

exports.getAll = async (req, res) => {
    try {
        const { minprice, maxprice, sort, find } = req.query;

        const sneakerInstances = await Sneaker.findAll({
            include: [{
                model: Image,
                as: "images",
                attributes: ["src"]
            }]
        });

        let filtered = sneakerInstances.map(sneaker => ({
            id: sneaker.id,
            title: sneaker.title,
            price: sneaker.price,
            description: sneaker.description,
            image: sneaker.images.map(img => img.src)
        }));

        if (minprice !== undefined && minprice !== '' && !isNaN(minprice)) {
            let min = parseInt(minprice);
            filtered = filtered.filter(item => item.price >= min);
        }

        if (maxprice !== undefined && maxprice !== '' && !isNaN(maxprice)) {
            let max = parseInt(maxprice);
            filtered = filtered.filter(item => item.price <= max);
        }

        if (find !== undefined && find !== '') {
            filtered = filtered.filter(item => item.title.toLowerCase().includes(find.toLowerCase()));
        }


        if (sort == "ascending") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort == "descending") {
            filtered.sort((a, b) => b.price - a.price);
        }



        // Отправляем ответ из контроллера
        res.render("katalog.hbs", {
            sneakers: filtered,
            minprice: minprice || '',
            maxprice: maxprice || '',
            find: find || ''
        });
    } catch (error) {
        console.error("Ошибка в getAll:", error);
        res.status(500).send("Не удалось загрузить каталог");
    }
};

exports.getNine = async (req, res) => {
    try {
        const sneakerInstances = await Sneaker.findAll({
            include: [{
                model: Image,
                as: "images",
                attributes: ["src"]
            }],
            limit: 9
        });

        const sneakers = sneakerInstances.map(sneaker => ({
            id: sneaker.id,
            title: sneaker.title,
            price: sneaker.price,
            description: sneaker.description,
            image: sneaker.images.map(img => img.src)
        }));

        res.render("index.hbs", { sneakers });
    } catch (error) {
        console.error("Ошибка в getAll:", error);
        res.status(500).send("Не удалось загрузить каталог");
    }
};

exports.product = async (req, res) => {

    id = req.query.id;
    try {
        const sneaker = await Sneaker.findByPk(id, {
            include: [{ model: Image, as: "images" }],
        });
        if (!sneaker) return res.status(404).json({ message: "Article not found" });
        res.render("product.hbs",
            {
                title: sneaker.title,
                price: sneaker.price,
                image: sneaker.images.map(img => img.src),
                description: sneaker.description
            }
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

exports.reviews = async (req, res) => {
    const { find } = req.query;

    const reviewModel = await Review.findAll();

    let filtered = reviewModel;

    if (find !== undefined && find !== '') {
        filtered = filtered.filter(item => item.author.toString().toLowerCase().includes(find.toLowerCase()) || item.text.toString().toLowerCase().includes(find.toLowerCase()));
    }

    res.render("reviews.hbs", { reviews: filtered });
}


exports.logIn = async (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
        if (err) {
            console.error("Ошибка парсинга формы:", err);
            return res.status(500).json({ message: "Ошибка обработки данных" });
        }

        const { username, password } = fields;

        console.log(fields);

        if (!username || !password) {
            return res.status(400).json({ message: "Email и пароль обязательны" });
        }

        let account = await User.findOne({ where: { username } });
        let role = "user";
        if (!account) {
            account = await Admin.findOne({ where: { username } });
            role = "admin";
        }


        if (!account) {
            res.status(401).json({ message: "Неверный email или пароль" });
        }
        const isMatch = await bcrypt.compare(password[0], account.password);
        if (!isMatch) {
            res.status(401).json({ message: "Неверный email или пароль" });
        }


        req.session.username = username[0];

        const user = await User.findOne({
            where: { username },
            include: [{
                model: CartItem,
                as: "cartitems",
                attributes: ["productId", "quantity"]
            }]
        });

        if (user && user.cartitems) {
            req.session.cart = user.cartitems.map(item => ({
                id: item.productId,
                quantity: item.quantity
            }));
        } else {
            req.session.cart = [];
        }

        console.log(req.session.cart, "корзина");

        if (role === 'user') {
            req.session.auth = true;
            res.redirect("/auth/katalog")
        } else if (role === 'admin') {
            req.session.admin = true;
            return res.redirect("/admin/")
        } else {
            res.json("Ошибка");
        }


    });
}
exports.register = async (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
        const users = await User.findAll();

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
        const hashedPassword = await bcrypt.hash(password[0], 10);

        await User.create({ username: username[0], password: hashedPassword });

        req.session.auth = true;
        req.session.username = username[0];

        res.redirect("/auth/katalog")
    });
}