const userDao = require('../models/userDao');
const jwt = require('jsonwebtoken');
const { transPassword, checkHash } = require('../middlewares/bcrypt');

const signUp = async (name, email, password, phone, address, birth, gender) => {
  const hashedPassword = await transPassword(password);
  const signUp = await userDao.signUp(
    name,
    email,
    hashedPassword,
    phone,
    address,
    birth
  );
  if (gender) {
    const user = await userDao.getUserbyEmail(email);
    const createGender = await userDao.createGender(user.id, gender);
  }
};

const signIn = async (email, password) => {
  const users = await userDao.getUserbyEmail(email);

  if (!users) {
    const err = new Error('NOT_AVAILABLE_USER');
    err.statusCode = 401;
    throw err;
  }

  const ismatch = checkHash(password, users.passwords);

  if (!ismatch) {
    const err = new Error('PASSWORD_NOT_MATCH');
    err.statusCode = 401;
    throw err;
  }

  const payLoad = { id: users.id };
  const jwtToken = jwt.sign(payLoad, process.env.SECRET_KEY, {
    expiresIn: '1d',
    issuer: 'min',
    // notBefore: Date.now() + 3600,
  });

  return { names: users.names, Token: jwtToken };
};

const getUserById = async (id) => {
  return await userDao.getUserById(id);
};

module.exports = {
  signUp,
  signIn,
  getUserById,
};
