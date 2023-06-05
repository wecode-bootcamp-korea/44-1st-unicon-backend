const bcrypt = require('bcrypt');

const transPassword = async (password) => {
  const saltRounds = 14;

  return bcrypt.hash(password, saltRounds);
};

const checkHash = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  transPassword,
  checkHash,
};
