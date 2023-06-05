const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const checkHash = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword) 
}
module.exports = {
  hashPassword,
  checkHash
};
