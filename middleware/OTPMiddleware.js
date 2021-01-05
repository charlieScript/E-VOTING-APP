const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

/**
 * @access
 * Verify, Dashboard Page
 * @description
 * Here this middleware runs only for the verify, dashboard page
 * it checks if there is a cookie  if found it is verified and if an err is found it the jwt the user is redirected to the register page
 * if not found the user is left the page
 * 
 * @param {*} req cookie.jwt
 * @param {*} res if valid - (user data) if err (register page)
 */
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/register');
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/register');
  }
};

/**
 * @access
 * Verify Page
 * @description
 * Here this middleware runs only for the verify page
 * it checks if there is a cookie if found if it a oldUser the user is redrected to the dashboard because they are logged n before
 * if not found the user is left the page
 * 
 * @param {*} req cookie.oldUser
 * @param {*} res if valid - (dashboard page) if err (verify page)
 */
const userLoggedIn = async (req, res, next) => {
  if (req.cookies.oldUser) {
    res.redirect('/dashboard')
  } else {
    next()
  }
}

/**
 * @access
 * Dashboard Page
 * @description
 * Here this middleware runs only for the dashboard page
 * it checks if there is a cookie if found if it a oldUser the user is there
 * if not found the user is left to home page
 * 
 * @param {*} req cookie.oldUser
 * @param {*} res home page
 */
const checkDashboard = (req, res, next) => {
  if (req.cookies.oldUser) {
    next();
  } else {
    res.redirect('/');
  }
};


/**
 * @access
 * Regster Page
 * @description
 * Here this middleware runs only for the register page
 * it checks if there is a cookie if found the user is redirected to
 * veify page
 * if not found the user is left to register
 * 
 * @param {*} req cookie.jwt
 * @param {*} res verify page
 */
const secureRegister = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    // res.redirect('/verify');
    // next()
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err.message);
        next()
      } else {
        res.redirect('/verify');
      }
    });
  } else {
    next();
  }
};


/**
 * @access
 * Login Page
 * @description
 * Here this middleware runs only for the login page
 * it checks if there is a cookie if found the user is redirected to
 * veify page
 * if not found the user is left to login
 * 
 * @param {*} req cookie.jwt
 * @param {*} res verify page
 * @param {*} next 
 */

const secureLogin = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        next()
      } else {
        res.redirect('/verify');
      }
    });
  } else {
    next();
  }
};

/**
 * @description
 * This middlware runs for every route it checks the browser cookie if it isn't found
 * it send no data to the frontend
 * if found it is then verified and the jwt is decoded and the payload(user id)
 * is searched in the database and the data is sent to the view
 *  @param {*} req cookies.jwt
 *  @param {*} res user- info in database
 */
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await Student.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

/**
 * 
 * @param {*} req headers.auth
 * @param {*} res 
 * @param {*} next 
 */
const authAddCandidates = (req, res, next) => {
  if (req.headers.auth === 'onedibechigoziecharles') {
    next()
  } else {
    res.status(401).json({ message: 'You are not authorised'})
  }
}


module.exports = { checkUser, requireAuth , secureRegister, secureLogin, userLoggedIn, checkDashboard, authAddCandidates};
