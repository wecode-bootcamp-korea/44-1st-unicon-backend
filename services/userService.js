const userDao = require('../models/userDao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 회원가입 구현
const signUp = async (address, birth, email, name, password, phone, gender) => {
  //Bcrypt 비밀번호 암호화
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return userDao.signUp(
    address,
    birth,
    email,
    name,
    hashedPassword,
    phone,
    gender
  );
};

// 로그인 구현
const signIn = async (email, password) => {
  if (!email) {
    const err = new Error('NOT_AVAILABLE_USER');
    err.statusCode = 401;
    throw err;
  }

  const ismatch = await bcrypt.compare(password, users.password);
  if (!ismatch) {
    const err = new Error('PASSWORD_NOT_MATCH');
    err.statusCode = 401;
    throw err;
  }

  //Bcrypt 검증
  const checkHash = bcrypt.compare(password, hashedPassword);

  if (!checkHash) {
    const err = Error('NOT_AVAILABLE_USER');
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
