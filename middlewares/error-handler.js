const { isCelebrateError } = require("celebrate");
const {
  BAD_REQUEST_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

module.exports = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Invalid JSON in request body" });
  }

  if (isCelebrateError(err)) {
    const [, joiError] = [...err.details][0];
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: joiError.message });
  }

  const { statusCode = DEFAULT_ERROR_CODE, message } = err;

  return res.status(statusCode).send({
    message:
      statusCode === DEFAULT_ERROR_CODE
        ? "An error has occurred on the server."
        : message,
  });
};
