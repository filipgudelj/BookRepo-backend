const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8,
  },
  fileFilter: fileFilter,
});

const router = express.Router();
const { createBook, getAllBooks } = require("../controllers/book");
const { isAuth } = require("../middlewares/auth");

router.post(
  "/create-book",
  isAuth,
  upload.single("bookImage"),
  createBook,
  async (req, res) => {
    res.send("Welcome to create-book route!");
  }
);
router.get("/books", isAuth, getAllBooks);

module.exports = router;
