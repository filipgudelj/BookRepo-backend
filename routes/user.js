const express = require("express");

const router = express.Router();
const { createUser, userSignIn, signOut } = require("../controllers/user");
const {
  validateUserSignUp,
  validateUserSignIn,
  userValidation,
} = require("../middlewares/validation/user");
const { isAuth } = require("../middlewares/auth");

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
router.post("/sign-out", isAuth, signOut);

module.exports = router;
