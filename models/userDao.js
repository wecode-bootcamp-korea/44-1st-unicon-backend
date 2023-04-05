const appDataSource = require('./appDataSource');

// 유저 회원가입
const signUp = async (
  name,
  email,
  hashedPassword,
  phone,
  address,
  birth,
  gender
) => {
  try {
    const user = await appDataSource.query(
      `INSERT INTO users(
		    names,
        email,
        passwords,
        phone_number,
        addresses,
        birth,
        points

		  ) VALUES (?, ?, ?, ?, ?, ?, 5000);
		`,
      [name, email, hashedPassword, phone, address, birth]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};

// 로그인
const getUserbyEmail = async (email) => {
  try {
    const [user] = await appDataSource.query(
      `SELECT
         names,
         email,
         passwords,
         id
      FROM
         users
      WHERE
         users.email = ?;
      `,
      [email]
    );
    return user;
  } catch (err) {
    const error = new Error('NOT_FOUND_EMAIL');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  signUp,
  getUserbyEmail,
};
