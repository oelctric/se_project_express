const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/users");
const itemRouter = require("./routes/clothingItems");
const { login, createUser } = require("./controllers/users");
const {
  NOT_FOUND_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors());
app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/users", userRouter);
app.use("/items", itemRouter);

app.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Invalid JSON in request body" });
  }
  console.error(err);
  return res
    .status(DEFAULT_ERROR_CODE)
    .send({ message: "An error has occurred on the server." });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
