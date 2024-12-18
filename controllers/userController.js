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

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(
          "There was an error while trying to hash the password",
          err
        );
        throw err;
      }
      if (!errors.isEmpty()) {
        return res.status(400).render("sign-up", {
          errors: errors.array(),
        });
      } else {
        const createUser = await db.postCreateUser(
          first_name,
          last_name,
          email,
          hashedPassword,
          hashedPassword,
          "non-member"
        );

        res.redirect("/");
      }
    });
  }),
];

exports.userLogInGet = asyncHandler(async (req, res, next) => {
  res.render("log-in");
});

exports.userBecomeMemberGet = asyncHandler(async (req, res, next) => {
  res.render("become-member");
});

exports.userBecomeMemberPost = [
  asyncHandler(async (req, res, next) => {
    const findLoggedUserById = await db.getUser(req.user.id);

    const { memberPassword } = req.body;

    if (!findLoggedUserById || memberPassword !== process.env.memberPassword) {
      res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    } else {
      const updateUserMembershipStatus = await db.postBecomeMember(
        "member",
        req.user.id,
        req.user.id
      );

      // console.log(updateUserMembershipStatus);

      res.redirect("/");
    }
  }),
];

exports.userBecomeAdminGet = asyncHandler(async (req, res, next) => {
  res.render("become-admin");
});

exports.userBecomeAdminPost = [
  asyncHandler(async (req, res, next) => {
    const findLoggedUserById = await db.getUser(req.user.id);

    const { adminPassword } = req.body;

    if (!findLoggedUserById || adminPassword !== process.env.adminPassword) {
      res.redirect("https://www.youtube.com/watch?v=c4kFLMsRnS4");
    } else {
      const updateUserMembershipStatus = await db.postBecomeMember(
        "admin",
        req.user.id,
        req.user.id
      );

      // console.log(updateUserMembershipStatus);

      res.redirect("/");
    }
  }),
];
