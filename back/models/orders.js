const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Order = sequelize.define(
    "Order",
    {
        username:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1,
            },
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    { timestamps: true }
);

module.exports = Order;