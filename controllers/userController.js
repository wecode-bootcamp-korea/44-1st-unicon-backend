const userService = require('../services/userService.js');
const { catchError } = require('../middlewares/error.js');

const signUp = catchError(async (req, res) => {
  const { name, email, password, phone, address, birth, gender } = req.body;

  if (!name || !email || !password || !phone || !address || !birth || !gender) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }

  await userService.signUp(
    name,
    email,
    password,
    phone,
    address,
    birth,
    gender
  );
   res.status(201).json({ message: 'SIGNUP_SUCCESS' });
});

const signIn = catchError(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'KEY_ERROR' });
  }

  const Token = await userService.signIn(email, password);
  res.status(200).json({ accesstoken: Token });
});

module.exports = {
  signUp,
  signIn,
};
