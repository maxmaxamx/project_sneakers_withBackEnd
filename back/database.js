const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME || "sneakers_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "root",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        port: process.env.DB_PORT || 3306,
        logging: process.env.NODE_ENV === "development" ? console.log : false,
    }
);

module.exports = sequelize;