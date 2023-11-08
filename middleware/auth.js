// auth.js

const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is logged in, proceed to the next middleware or route handler
    next();
  } else {
    // User is not logged in, redirect to the login page or handle accordingly
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
