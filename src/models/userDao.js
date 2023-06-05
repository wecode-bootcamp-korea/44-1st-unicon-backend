const appDataSource = require('./appDataSource');
const { DatabaseError } = require('../middlewares/error');

const signUp = async (name, email, hashedPassword, phone, address, birth) => {
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
    return user;
  } catch (err) {
    throw new DatabaseError('INVALID_DATA_INPUT');
  }
};

const createGender = async (userId, gender) => {
  try {
    return await appDataSource.query(
      `INSERT INTO gender(
        user_id,
        gender_type
        )VALUES(?,?)
      `,
      [userId, gender]
    );
  } catch (err) {
    throw new DatabaseError('dataSource Error');
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
    throw new DatabaseError('dataSource Error');
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
    // const user = await appDataSource.manager.findOneBy(users, {
    //   email: email,
    // });
    return user;
  } catch (err) {
    throw new DatabaseError('NOT_FOUND_EMAIL');
  }
};

module.exports = {
  signUp,
  getUserbyEmail,
  getUserById,
  createGender,
};
