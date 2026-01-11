const sequelize = require("./database"); // ваш подключенный sequelize
const Sneaker = require("./models/sneakers");
const Image = require("./models/images");
const User = require("./models/users");
const CartItem = require("./models/cart");


async function importAll() {
    const sneakerInstances = await Sneaker.findAll({
        include: [{
            model: Image,
            as: "images",
            attributes: ["src"]
        }]
        // ⚠️ НЕТ raw: true!
    });

    // Преобразуем в чистые объекты
    const sneakers = sneakerInstances.map(sneaker => ({
        id: sneaker.id,
        title: sneaker.title,
        price: sneaker.price,
        description: sneaker.description,
        image: sneaker.images.map(img => img.src) // массив путей
    }));

    for (let i = 0; i < sneakers.length; i++)
        console.log(sneakers[i]);
}

importAll();