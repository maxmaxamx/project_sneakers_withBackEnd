const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Sneaker = sequelize.define(
    "Sneaker",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    { timestamps: false }
);

module.exports = Sneaker