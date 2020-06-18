var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  var ls = new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      if (username !== "admin123") {
        return done(null, false, { message: "Invalid username" });
      }

      var user = { username: "admin123", password: "123abcdef" };
      if (password === "123abcdef") {
        return done(null, user);
      }

      return done(null, false, { message: "Invalid password " });
    }
  );

  passport.use(ls);
  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    return done(null, user);
  });
};
