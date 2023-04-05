const userDao = require('../models/userDao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 회원가입 구현
const signUp = async (name, email, password, phone, address, birth, gender) => {
  //Bcrypt 비밀번호 암호화
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return userDao.signUp(
    name,
    email,
    hashedPassword,
    phone,
    address,
    birth,
    gender
  );
};

// 로그인 구현
const signIn = async (email, password) => {
  const users = await userDao.getUserbyEmail(email);

  if (!users) {
    const err = new Error('NOT_AVAILABLE_USER');
    err.statusCode = 401;
    throw err;
  }

  const ismatch = await bcrypt.compare(password, users.passwords);

  if (!ismatch) {
    const err = new Error('PASSWORD_NOT_MATCH');
    err.statusCode = 401;
    throw err;
  }

  // JWT 발급
  const payLoad = { id: users.id };
  const jwtToken = jwt.sign(payLoad, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });

  return jwtToken;
};

module.exports = {
  signUp,
  signIn,
};
