const userService = require('../services/userService.js');

const signUp = async (req, res) => {
  try {
    const { address, birth, email, name, gender, password, phone } = req.body;

    if (
      !address ||
      !birth ||
      !email ||
      !name ||
      !password ||
      !phone ||
      !gender
    ) {
      return res.status(400).json({ message: 'KEY_ERROR' });
    }

    await userService.signUp(
      address,
      birth,
      email,
      name,
      gender,
      password,
      phone,
      gender
    );
    return res.status(201).json({ message: 'SIGNUP_SUCCESS' });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  signUp,
};
