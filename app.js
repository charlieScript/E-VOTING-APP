const express = require('express')
const app = require('express')();
const mongoose = require('mongoose');
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cookieParser = require('cookie-parser');
const morgan = require('morgan')

// const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000

// middleware
app.use(morgan('dev'))
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/e-voting-app';
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => http.listen(PORT, console.log(`server started on port ${PORT}`)))
  .catch((err) => console.log(err));

const routes = require('./routes/allRoutes')
const { checkUser, requireAuth } = require('./middleware/OTPMiddleware');

// routes
app.use('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.use(routes);


const Candidates = require('./models/Candidates');
const Student = require('./models/Student');
/**
 * @description
 * A route thcl
 */
app.post('/vote', requireAuth, async (req, res) => {
  const { candidate } = req.body;
  try {
    const voter = await Student.findById(req.user.id);
    const match = await Candidates.findOne({ name: candidate });
    if (voter) {
      match.votes++;
      await match.save();
      voter.voted = true;
      await voter.save();
      const results = await Candidates.find({}).select('name votes');
      io.emit('data', results);
      res.status(200).json({ message: 'voted!' });
    } else {
      res.status(401).json({ errors: 'You voted already!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'an error occured!' });
  }
});
