const catchError = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};
const errorHandler = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({ message: err.message });
};
class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.status = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { catchError, BaseError, errorHandler };

