const Candidates = require('../models/Candidates');
const Student = require('../models/Student');
const bcrypt = require('bcrypt');

// utils and helpers
const {
  createToken,
  handleErrors,
  totp,
  authenticator,
} = require('../utils/utils');

const Nodemailer = require('../utils/nodemailer');
const maxAge = Number.MAX_SAFE_INTEGER;

/**
 * @access
 * Register Page
 * @description
 * it renders register page
 *
 * @param {*} req
 * @param {*} res
 */
const register_get = async (req, res) => {
  res.render('register');
};


//password hashing
const hasher = async (password) => {
  const salt = await bcrypt.genSalt()
  const hash = await bcrypt.hash(password, salt)
  return hash
}


const register_post = async (req, res) => {
  const secret = authenticator.generateSecret(10);
  // const token = totp.generate(process.env.OTP_SECRET);
  const { email, number, password } = req.body;
  const newPassword = hasher(password)
  try {
    const student = await Student.create({
      email,
      regNumber: number,
      password,
      voted: false,
      verified: false,
      secret,
    });
    otp = totp.generate(student.secret);
    student.otp = otp;
    await student.save();
    console.log(student.email, student.otp);
    Nodemailer(student.email, 'OTP', String(student.otp)).catch((error) =>
      console.log(error),
    );
    const cookie = createToken(student.id);
    res.cookie('jwt', cookie, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: student.id });
  } catch (error) {
    const err = handleErrors(error);
    res.status(401).json({ errors: err });
  }
};

const verify_get = async (req, res) => {
  res.render('verify');
};

const verify_post = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    const isValid = totp.verify({
      token: req.body.number,
      secret: student.secret,
    });
    if (isValid) {
      student.verified = true;
      await student.save();
      res.cookie('oldUser', true, Number.MAX_SAFE_INTEGER);
      res.status(200).json({ isValid: isValid });
    } else {
      res.status(401).json({ message: 'invalid pin' });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'an error occured' });
  }
};

const login_get = async (req, res) => {
  res.render('login');
};

const login_post = async (req, res) => {
  const regNumber = req.body.number;
  // const password = req.body.password;
  // // console.log(regNumber, password);
  // const student = await Student.findOne({ regNumber: regNumber });
  // const pass = await bcrypt.compare(password, student.password)
  // res.json(pass)
  try {
    const student = await Student.findOne({ regNumber: regNumber }).exec();
    console.log(student);
    if (student.length === 0) {
      res.status(401).json({ errors: 'user not found' });
    } else {
      const cookie = createToken(student.id);
      res.cookie('jwt', cookie, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: student.id });
    }
  } catch (error) {
    console.log(error)
  }
  
  
};

const dashboard_get = async (req, res) => {
  res.render('dashboard');
};

const candidate_post = async (req, res) => {
  try {
    await Candidates.create(req.body);
    res.status(200).json({ message: 'Candidtes added!' });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'an error occured' });
  }
};

const results_get = async (req, res) => {
  const candidates = await Candidates.find({});
  res.render('results', {
    data: candidates,
  });
};

const logout_post = async (req, res) => {
  res.cookie('jwt', '', maxAge);
  res.cookie('oldUser', '', maxAge);
  res.redirect('/');
};

module.exports = {
  register_get,
  register_post,
  verify_get,
  verify_post,
  login_get,
  login_post,
  dashboard_get,
  // vote_post,
  candidate_post,
  results_get,
  logout_post,
};
