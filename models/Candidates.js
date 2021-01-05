const mongoose = require('mongoose');

const candidatsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  votes: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true
  }
});

const Candidates = mongoose.model('candidates', candidatsSchema);

module.exports = Candidates;
