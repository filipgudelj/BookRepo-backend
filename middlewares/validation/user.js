const { check, validationResult } = require("express-validator");

exports.validateUserSignUp = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is required!")
    .isString()
    .withMessage("Must be a valid username!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be within 3 to 20 character!"),
  check("email").isEmail().withMessage("Invalid email!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is empty!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Both password must be same!");
      }
      return true;
    }),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ succes: false, message: error });
};

exports.validateUserSignIn = [
  check("email").trim().isEmail().withMessage("Email / password is required!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email / password is required!"),
];
