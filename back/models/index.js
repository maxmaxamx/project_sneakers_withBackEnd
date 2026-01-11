const sequelize = require("../database");
const User = require("./users");
const CartItem = require("./cart");
const Sneaker = require("./sneakers");
const Image = require("./images");
const Review = require("./reviews");
const Admin = require("./admins");
const Order = require("./orders");

User.hasMany(CartItem, { foreignKey: "userId", as:"cartitems" , onDelete: "CASCADE" });
CartItem.belongsTo(User, { foreignKey: "userId" });

Sneaker.hasMany(Image, { foreignKey: "sneakerId", as: "images", onDelete: "CASCADE" });
Image.belongsTo(Sneaker, { foreignKey: "sneakerId" });

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("✅ Database synchronized");
    } catch (error) {
        console.error("❌ Database sync error:", error);
    }
}

module.exports = { sequelize, User, CartItem, Image, Sneaker, Review, Admin, Order, syncDatabase };