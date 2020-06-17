var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Login" });
});

router.post("/", function (req, res, next) {
  const { username, password } = req.body;
  if (username !== "admin123" && password !== "123abcdef") {
    res.render("index", {
      title: "Login",
      error: true,
      style: "<link rel='stylesheet' href='/stylesheets/style.css' />",
    });
  } else {
    res.redirect("/elections/");
  }
});

module.exports = router;
