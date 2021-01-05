const router = require('express').Router()

const { register_get, register_post, verify_get, verify_post, login_get, login_post, dashboard_get, vote_post, candidate_post, results_get, logout_post } = require('../controllers/userController');
const { requireAuth, secureRegister, secureLogin, userLoggedIn, checkDashboard, authAddCandidates  } = require('../middleware/OTPMiddleware');

const Candidates = require('../models/Candidates')

// @get register page
router.get('/register', secureRegister, register_get)

// @post register
router.post('/register', secureRegister, register_post)

//@get verify
router.get('/verify', requireAuth, userLoggedIn, verify_get)

//@post verify
router.post('/verify', requireAuth, verify_post)

//@get login
router.get('/login', secureLogin, login_get)

//@post login
router.post('/login', login_post);

//@post login
router.post('/logout', logout_post);


//@get dashboard
router.get('/dashboard', requireAuth, checkDashboard, dashboard_get)


//@post vote
// router.post('/vote', requireAuth, vote_post)

//@post candidates 
router.post('/candidates', authAddCandidates, candidate_post)

router.get('/results', results_get);





module.exports = router