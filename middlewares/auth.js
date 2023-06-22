const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decode.userId);
      if (!user) {
        return res.json({ succes: false, message: "Unathorized access!" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.json({ succes: false, message: "Unathorized access!" });
      }
      if (error.name === "TokenExpiredError") {
        return res.json({
          succes: false,
          message: "Session expired, try sign-in!",
        });
      }
      res.json({
        succes: false,
        message: "Internal server error!",
      });
    }
  } else {
    res.json({ succes: false, message: "Unathorized access!" });
  }
};
