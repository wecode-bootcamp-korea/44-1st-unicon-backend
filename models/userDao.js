const appDataSource = require('./appDataSource');
const { catchError } = require('../middlewares/error.js');
// 유저 회원가입
const signUp = async (name, email, password, phone, birth, address, gender) => {
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
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};

// 로그인
const getUserbyEmail = catchError(async (email) => {
  await appDataSource.query(
    `SELECT
         names,
         email,
         passwords,
         phone_number,
         addresses,
         birth,
         points
      FROM
         users
      WHERE
         users.email = ?
      `,
    [email]
  );
});

module.exports = {
  signUp,
  getUserbyEmail,
};
