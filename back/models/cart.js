const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const CartItem = sequelize.define(
    "CartItem",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users", // имя таблицы (по умолчанию — множественное число от имени модели)
                key: "id",
            },
            onDelete: "CASCADE", // если удалим юзера — корзина тоже удалится
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // можно добавить foreign key на таблицу товаров, если она есть
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1,
            },
        },
    },
    { timestamps: false } // корзина обычно не требует createdAt/updatedAt
);

module.exports = CartItem;