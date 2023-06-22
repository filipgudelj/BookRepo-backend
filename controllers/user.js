const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      succes: false,
      message: "This email is already in use, try sign-in.",
    });
  const user = await User({
    username,
    email,
    password,
  });
  await user.save();
  res.json(user);
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.json({
      succes: false,
      message: "User not found, with the given email!",
    });
  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      succes: false,
      message: "Email / password does not match!",
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  let oldTokens = user.tokens || [];

  if (oldTokens.length) {
    oldToken = oldTokens.filter((t) => {
      const timeDiff = Date.now() - parseInt(t.signedAt) / 1000;
      if (timeDiff < 86400) {
        return t;
      }
    });
  }

  await User.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  });

  res.json({ succes: true, user, token });
};

exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization fail!" });
    }
    const tokens = req.user.tokens;

    const newTokens = tokens.filter((t) => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: "Sign out successfully!" });
  }
};
