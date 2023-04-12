const appDataSource = require('./appDataSource');
const { DatabaseError } = require('../middlewares/error');

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
    const DEFAULT_POINTS = 99999;
    const user = await appDataSource.query(
      `INSERT INTO users(
		      names,
          email,
          passwords,
          phone_number,
          addresses,
          birth,
          points
       ) VALUES (?, ?, ?, ?, ?, ?, ?);
		  `,
      [name, email, hashedPassword, phone, address, birth, DEFAULT_POINTS]
    );
  } catch (err) {
    const error = new DatabaseError('INVALID_DATA_INPUT');
  }
};

const getUserById = async (id) => {
  try {
    const result = await appDataSource.query(
      `SELECT
       id,
       names,
       email,
       passwords
      FROM
       users
      WHERE
        users.id = ?;
       `,
      [id]
    );
    return result;
  } catch (err) {
    const error = new DatabaseError('dataSource Error');
  }
};

const getUserbyEmail = async (email) => {
  try {
    const [user] = await appDataSource.query(
      `SELECT
          id,
          names,
          email,
          passwords
      FROM
          users
      WHERE
          users.email = ?;
      `,
      [email]
    );
    return user;
  } catch (err) {
    const error = new DatabaseError('NOT_FOUND_EMAIL');
  }
};

module.exports = {
  signUp,
  getUserById,
  getUserbyEmail,
  getUserById,
};
