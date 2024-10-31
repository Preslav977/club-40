const { Router } = require("express");

const indexRouter = Router();

const db = require("../db/indexQueries");

indexRouter.get("/", async (req, res, next) => {
  res.render("index", {
    user: req.user,
    messages: await db.getMessagesWithUsers(),
  });
});

module.exports = indexRouter;
