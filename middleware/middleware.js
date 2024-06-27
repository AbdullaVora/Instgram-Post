const { userModel } = require("../models/model");

const localStorage = require("passport-local").Strategy;

const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    console.log("Not Authenticated");
    res.redirect("/loginPage");
  }
};

const localAuth = (passport) => {
  passport.use(
    new localStorage(
      { usernameField: "email" },
      async (email, password, done) => {
        let user = await userModel.findOne({ email: email });

        try {
          if (!user) {
            console.log("User Not Found..");
            done(null, false);
          } else if (user.password !== password) {
            console.log("Password Incorrect...");
            done(null, false);
          } else {
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const userfind = await userModel.findById(id);
      done(null, userfind);
    } catch (error) {
      done(error, false);
    }
  });
};

module.exports = { isAuth, localAuth };
