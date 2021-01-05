const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  regNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  // password: {
  //   type: String,
  //   required: true,
  //   minlength: [6, 'password is less than 6 characters'],
  // },
  otp: {
    type: Number,
    unique: true
  },
  voted: {
    type: Boolean,
    required: true
  },
  verified: {
    type: Boolean,
    required: true
  },
  secret: {
    type: String,
    required: true,
    unique: true
  }
})

// // Password Hashing
// studentSchema.pre('save', async function (next) {
//   // console.log('user is about to be created', this)

//   // genarate a salt
//   const salt = await bcrypt.genSalt();

//   // 'this' refers to the user
//   this.password = await bcrypt.hash(this.password, salt);

//   next();
// });

const Student = mongoose.model('student', studentSchema)

module.exports = Student