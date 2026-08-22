const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid data passed for creating an item" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN_ERROR_CODE)
          .send({ message: "You can only delete your own items" });
      }
      return item.deleteOne().then(() => res.send(item));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};
