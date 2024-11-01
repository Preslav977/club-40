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

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    async (email, password, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        const user = rows[0];

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
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

app.post(
  "/user/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/log-in",
  })
);

app.get("/user/log-out", (req, res, next) => {
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
