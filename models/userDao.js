const appDataSource = require('./appDataSource');

// 유저 회원가입
const signUp = async (address, birth, email, name, password, phone, gender) => {
  try {
    const user = await appDataSource.query(
      `INSERT INTO users(
        names,
        email,
        passwords,
        phone_number,
        birth,
        addresses,
        points

      ) VALUES (?, ?, ?, ?, ?, ?, 5000);
    `,
      [name, email, password, phone, birth, address]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  signUp,
};
