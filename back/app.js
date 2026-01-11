require("dotenv").config();
const { syncDatabase } = require("./models");
const { PORT } = process.env;


const express = require("express");
const path = require("path");

const bcrypt = require("bcrypt");
const hbs = require("hbs");
const smartRouter = require("./routes/smart");
const privateRouter = require("./routes/private");
const adminRouter = require("./routes/admin");
const { authInit, checkAuth } = require("./middleware/authMiddlewear");

const app = express();

app.use(express.json());
app.use(authInit());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "/views/partials"));

app.use(smartRouter);
app.use("/auth", privateRouter);
app.use("/admin", adminRouter);


app.listen(PORT, async () => {
    console.log("Server is running on port 3000");
    try {
        await syncDatabase();
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (error) {
        console.error("COULD NOT CONNECT TO DATABASE:", error.message);
    }
});
