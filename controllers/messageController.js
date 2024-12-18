const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

const db = require("../db/messageQueries");

const validateMessage = require("../middlewares/validateMessage");

exports.newMessageGet = asyncHandler(async (req, res, next) => {
  res.render("new-message");
});

exports.newMessagePost = [
  validateMessage,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { title, content } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render("new-message", {
        errors: errors.array(),
      });
    } else {
      const createMessage = await db.postMessageCreate(
        title,
        content,
        req.user.id
      );

      res.redirect("/");
    }
  }),
];

exports.newMessageDeletePost = [
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const deleteMessage = await db.postMessageDelete(id);

    console.log(deleteMessage);

    res.redirect("/");
  }),
];
