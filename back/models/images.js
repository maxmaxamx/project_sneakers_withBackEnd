const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Image = sequelize.define(
    "Image",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sneakerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        src: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    { timestamps: false }
);

module.exports = Image;