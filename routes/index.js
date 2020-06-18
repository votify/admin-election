var express = require("express");
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Login",
    style: "<link rel='stylesheet' href='/stylesheets/style.css' />",
  });
});

router.post("/", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.render("index", {
        title: "Login",
        error: true,
        style: "<link rel='stylesheet' href='/stylesheets/style.css' />",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/elections/");
    });
  })(req, res, next);
});

module.exports = router;
