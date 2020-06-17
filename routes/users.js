var express = require("express");
var router = express.Router();

/* GET users listing. */
router.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  if (username !== "admin123" && password !== "123abcdef") {
    res.json({ status: false });
  } else {
    res.redirect("/elections/");
  }
});

module.exports = router;
