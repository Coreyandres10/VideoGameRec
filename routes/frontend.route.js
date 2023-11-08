const { requireAuth } = require("../middleware/auth");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/home", (req, res) => {
  res.render("index");
});

router.get("/profile", requireAuth, (req, res) => {
  // Render the profile page with the user information
  res.render("profile", { user: req.session.user });
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/notfound", (req, res) => {
  res.render("notfound");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});

module.exports = router;
