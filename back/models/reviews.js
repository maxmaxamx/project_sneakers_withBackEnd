const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Review = sequelize.define(
    "Review",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    { timestamps: true }
);

module.exports = Review