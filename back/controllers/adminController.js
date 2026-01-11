const { User, CartItem, Image, Review, Admin, Sneaker, Order } = require("../models");
const { sneakers, users, reviews, param, validateCredentials, checkExistion, register } = require("../data/information")
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const fs = require("fs").promises;
const path = require("path");


exports.addSneaker = async (req, res) => {
    const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'images');

    let form = new formidable.IncomingForm({ keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Ошибка парсинга формы:", err);
            return res.status(500).json({ message: "Ошибка обработки данных" });
        }
        console.log(fields);

        const title = fields.title[0];
        const price = fields.price[0];
        const description = fields.description[0];

        await Sneaker.create({
            title: title,
            price: price,
            description: description
        });

        let images = files.images;
        if (!Array.isArray(images)) images = [images];
        let lastId = await Sneaker.max('id');
        let src = null;
        const imagePaths = [];

        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const ext = path.extname(file.originalFilename);
            const newFilename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
            const newPath = path.join(UPLOAD_DIR, newFilename);

            await fs.copyFile(file.filepath, newPath);
            await fs.unlink(file.filepath);
            src = '/images/' + newFilename
            imagePaths.push(src);

            await Image.create({
                sneakerId: lastId,
                src: src
            });
        }

        res.redirect('/admin/katalog');
    });
}

exports.adminPage = async (req, res) => {
    const sneakerInstances = await Sneaker.findAll({
        include: [{
            model: Image,
            as: "images",
            attributes: ["src"]
        }]
    });

    const orders = await Order.findAll({ raw: true });

    const sneakers = sneakerInstances.map(order => ({
        id: order.id,
        title: order.title,
        price: order.price,
        image: order.images[0].src
    }));


    if (orders) {
        const usersOrder = [];
        const fullOrders = orders
            .map((item) => {
                const product = sneakers.find((s) => s.id == item.productId);
                if (!product) return null;
                product.price *= item.quantity;
                return {
                    ...item,
                    product
                };
            })
            .filter(Boolean);
        for (let i = 0; i < fullOrders.length; i++) {
            const existingUser = usersOrder.find(u => u.username === fullOrders[i].username);


            if (existingUser) {
                existingUser.orders.push({
                    id: fullOrders[i].id,
                    quantity: fullOrders[i].quantity,
                    phone: fullOrders[i].phone,
                    address: fullOrders[i].address,
                    image: fullOrders[i].product.image,
                    price: fullOrders[i].product.price,
                    title: fullOrders[i].product.title,
                });
                existingUser.total += fullOrders[i].product.price;
            } else {
                usersOrder.push({
                    username: fullOrders[i].username,
                    orders: [{
                        id: fullOrders[i].productId,
                        quantity: fullOrders[i].quantity,
                        phone: fullOrders[i].phone,
                        address: fullOrders[i].address,
                        image: fullOrders[i].product.image,
                        price: fullOrders[i].product.price,
                        title: fullOrders[i].product.title,
                    }],
                    total: fullOrders[i].product.price

                });
            }
        }
        res.render("admin/adminpage", { order: usersOrder });
    } else {
        res.render("admin/adminpage");
    }
};

exports.delete = async (req, res) => {
    let id = req.params.productId;
    await Order.destroy({ where: { username: id } });

    res.json({ success: true });
}