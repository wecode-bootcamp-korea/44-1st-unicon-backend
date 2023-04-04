const appDataSource = require('./appDataSource');

// 유저 회원가입
const createUser = async (
  address,
  birth,
  email,
  name,
  gender,
  password,
  phone
) => {
  try {
    return await appDataSource.query(
      `INSERT INTO users(
		    name,
        email,
        password,
        phone_number,
        birth,
        address,
        point

		  ) VALUES (?, ?, ?, ?, ?, ?, 5000000);
		`,
      [address, birth, email, name, gender, password, phone]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createUser,
};
