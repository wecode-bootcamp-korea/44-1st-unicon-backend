const userDao = require('../models/userDao');
const bcrypt = require('bcrypt');

// 회원가입 구현
const signUp = async (name, birth, phone, email, gender, address, password) => {
  // email 정규표현식
  const emailValid = new RegExp('/^S+@S+.S+$/i');

  // password 정규표현식
  const pwValid = new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])(?=.{8,20})');

  // 생일 정규 표현식
  const birthValid = new RegExp('/^(d{4})(/|-)(d{1,2})(/|-)(d{1,2})$/');

  // Phone 정규 표현식
  const phoneValid = new RegExp(
    '/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/'
  );

  if (
    !emailValid.test(email) ||
    !pwValid.test(password) ||
    !birthValid.test(birth) ||
    !phoneValid.test(phone)
  ) {
    const err = new Error('ALET_CHECK_INPUT');
    err.statusCode = 400;
    throw err;
  }

  //Bcrypt 비밀번호 암호화
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return userDao.createUser(
    name,
    birth,
    phone,
    email,
    gender,
    address,
    hashedPassword
  );
};

// 로그인 구현
const signIn = async (email, password) => {
  const user = await userDao.getUserByEmail(email);

  if (!user) {
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

  module.exports = {
    signUp,
    signIn,
  };
};
