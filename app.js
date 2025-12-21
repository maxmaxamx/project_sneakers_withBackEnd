const express = require("express");
const path = require("path");
const session = require('express-session');
const hbs = require("hbs");
const smartRouter = require("./routes/smart");
const privateRouter = require("./routes/private");
const { authInit, checkAuth } = require("./middleware/authMiddlewear");

const app = express();

app.use(express.json());
app.use(authInit());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "/views/partials"));

app.use(smartRouter);
// app.use((req,res,next)=>{console.log(req.session.auth, "Авториация"); next();});
app.use("/auth", privateRouter);



app.listen(3000, () => console.log("http://localhost:3000/"));
