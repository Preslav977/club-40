require("dotenv").config();

const express = require("express");

const path = require("node:path");

const session = require("express-session");

const pgSession = require("connect-pg-simple")(session);

const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcryptjs");

const pool = require("./db/pool");

const indexRouter = require("./routes/indexRouter");

const userRouter = require("./routes/userRouter");

const messageRouter = require("./routes/messageRouter");

const app = express({
  store: new pgSession({
    pool: pool,
    tableName: "sessions",
  }),
  secret: pgSessionSecret,
  resave: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());

app.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

const assetsPath = path.join(__dirname + "/public");

app.use(express.static(assetsPath));

app.use("/", indexRouter);

app.use("/user", userRouter);

app.use("/message", messageRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Express app - listening on port ${PORT}!`));

module.exports = app;
