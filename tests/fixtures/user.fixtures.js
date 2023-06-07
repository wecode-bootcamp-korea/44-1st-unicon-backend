const dataSource = require('../../src/models/appDataSource');
const bcrypt = require('bcrypt');

const createUser = async (userList) => {
  let data = [];
  const saltRounds = 12;

  for (const user of userList) {
    const password = await bcrypt.hash(user.password, saltRounds);
    data.push([
      user.name,
      user.email,
      password,
      user.phone,
      user.address,
      user.birth,
    ]);
  }

  return dataSource.query(
    `INSERT INTO users(
    names,
    email,
    passwords,
    phone_number,
    addresses,
    birth
 ) VALUES ?;
`,
    [data]
  );
};

module.exports = { createUser };
