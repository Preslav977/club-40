require("dotenv").config();

const express = require("express");

const path = require("node:path");

const session = require("express-session");

const pgSession = require("connect-pg-simple")(session);

const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcryptjs");

const indexRouter = require("./routes/indexRouter");

const userRouter = require("./routes/userRouter");

const messageRouter = require("./routes/messageRouter");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname + "/public");

app.use(express.static(assetsPath));

app.use("/", indexRouter);

app.use("/user", userRouter);

app.use("/message", messageRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Express app - listening on port ${PORT}!`));

module.exports = app;
