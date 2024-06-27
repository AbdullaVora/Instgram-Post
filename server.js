const express = require("express");
const router = require("./routers/router");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const { localAuth } = require("./middleware/middleware");
const dataBase = require("./config/database");
const app = express();
const port = 5050;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.use(
  session({
    secret: "Your Secret Key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
localAuth(passport);

app.use(router);

app.listen(port, (err) => {
  if (err) console.log(err);
  else dataBase();
  console.log(`Server was started http://localhost:${port}`);
});
