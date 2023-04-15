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

class baseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
class DatabaseError extends baseError {
  constructor(message) {
    super(message);
    this.code = 'DATABASE_ERROR';
    this.statusCode = 500;
  }
}


module.exports = { catchError, baseError, errorHandler, DatabaseError  };
