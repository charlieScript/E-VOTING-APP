const jwt = require('jsonwebtoken');
// create OTP
const { totp, authenticator } = require('otplib');
totp.options = {
  epoch: Date.now(),
  step: Number.MAX_SAFE_INTEGER,
  window: 0,
};

// create json web token thats lasts for ever
const maxAge = Number.MAX_SAFE_INTEGER;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};

// handle errors
const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = { regNumber: '', password: '', email: '' };

  // // incorrect email
  // if (err.message === 'Reg-Number is not valid') {
  //   errors.regNumber = 'Reg-Number is not valid';
  // }

  // if (err.message === 'student validation failed: password: password is less than 6 characters') {
  //   errors.password = 'password is less than 6 characters';
  //   return errors.password
  // }

  // duplicate email error
  if (err.code === 11000) {
    errors.regNumber = 'Reg-Number has been registered contact Web admnin for more info';
    errors.email = 'Email has already been used'
    return errors;
  }

  // // validation errors
  if (err.message.includes('student validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors
}

module.exports = {
  createToken,
  handleErrors,
  totp, 
  authenticator
}