const Book = require("../models/book");

exports.createBook = async (req, res) => {
  const { title, description, author, publisher } = req.body;
  const book = await Book({
    title,
    description,
    author,
    publisher,
    bookImage: req.file.path.replace(/\\/g, "/"),
  });
  await book.save();
  res.json(book);
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve books." });
  }
};
