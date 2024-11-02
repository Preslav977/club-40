const { body } = require("express-validator");

const titleLengthErr = "must be between 1 and 50 characters";

const matchErr = "must match only letters and dashes";

const contentLengthErr = "must be between 1 and 255 characters";

validateMessage = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage(`Title ${titleLengthErr}`)
    .matches(/^[a-zA-Z0-9_ ]*$/)
    .withMessage(`Title ${matchErr}`),
  body("content")
    .trim()
    .isLength({ min: 1, max: 255 })
    .escape()
    .withMessage(`Content ${contentLengthErr}`)
    .matches(/^[a-zA-Z0-9_ ]*$/)
    .withMessage(`Content ${matchErr}`),
];

module.exports = validateMessage;
