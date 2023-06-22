const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db");
const userRouter = require("./routes/user");
const bookRouter = require("./routes/book");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(userRouter);
app.use(bookRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(8000, () => {
  console.log("Port is listening.");
});
