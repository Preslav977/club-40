const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

const db = require("../db/userQueries");

const validateUser = require("../middlewares/validateUser");

const asyncHandler = require("express-async-handler");

exports.userCreateGet = asyncHandler(async (req, res, next) => {
  res.render("sign-up");
});

exports.userCreatePost = [
  validateUser,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      membership_status,
    } = req.body;

    console.log(
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      membership_status
    );

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(
          "There was an error while trying to hash the password",
          err
        );
        throw err;
      }
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      } else {
        const postUser = await db.postCreateUser(
          first_name,
          last_name,
          email,
          hashedPassword,
          hashedPassword,
          "non-member"
        );

        console.log(postUser);

        res.redirect("/");
      }
    });
  }),
];
