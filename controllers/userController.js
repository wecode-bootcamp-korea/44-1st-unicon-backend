const userService = require('../services/userService.js');
const { catchError } = require('../middlewares/error.js');

const signUp = catchError(async (req, res) => {
  const { address, birth, email, name, gender, password, phone } = req.body;

  if (!address || !birth || !email || !name || !password || !phone || !gender) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }

  await userService.signUp(
    address,
    birth,
    email,
    name,
    password,
    phone,
    gender
  );
  return res.status(201).json({ message: 'SIGNUP_SUCCESS' });
});

const signIn = catchError(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }

  await userService.signIn(email, password);
  return res.status(201).json({ message: 'SIGNUP_SUCCESS' });
});

module.exports = {
  signUp,
};
