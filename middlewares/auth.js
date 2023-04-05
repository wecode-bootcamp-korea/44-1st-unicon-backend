const validateToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization;
    const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY);

    req.user = decoded.payLoad.id;
    next();
  } catch (err) {
    const error = new Error('INVALID_TOKEN');
    error.statusCode = err.statusCode || 500;
    next(error);
  }

  return validateToken;
};

module.exports = {
  validateToken,
};
