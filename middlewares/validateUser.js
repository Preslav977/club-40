const { body, validationResult } = require("express-validator");

const lengthErr = "must be between 1 and 30 characters.";

const validErr = "must be valid email.";

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
  body("password").isLength({ min: 8 }),
  body("confirm_password").custom(
    (value, { req }) => value === req.body.password
  ),
];

module.exports = validateUser;
