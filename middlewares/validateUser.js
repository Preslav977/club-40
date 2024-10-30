const { body } = require("express-validator");

const lengthErr = "must be between 1 and 30 characters.";

const validErr = "must be valid email.";

const passwordLengthErr = "must be at least 8 characters.";

const passwordMatchErr = "must match.";

const validateUser = [
  body("first_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage(`First name ${lengthErr}`),
  body("last_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .trim()
    .isEmail()
    .withMessage(`Email ${validErr}`)
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage(`Email ${lengthErr}`),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .escape()
    .withMessage(`Password ${passwordLengthErr}`),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Password ${passwordMatchErr}`),
];

module.exports = validateUser;
