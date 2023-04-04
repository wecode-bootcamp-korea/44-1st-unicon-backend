const userDao = require('../models/userDao');
const bcrypt = require('bcrypt');

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

module.exports = {
  signUp,
};
