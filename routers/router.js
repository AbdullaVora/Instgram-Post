const Router = require("express");
const {
  home,
  loginPage,
  signPage,
  adduser,
  imageUpload,
  addpostPage,
  addPost,
  like,
  comment,
  logout,
  forgotPage,
  forgotcheck,
  verify,
  changePassword,
} = require("../controllers/controller");
const { isAuth } = require("../middleware/middleware");
const passport = require("passport");
const router = Router();

router.get("/", isAuth, home);
router.get("/loginPage", loginPage);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/loginPage",
  })
);
router.get("/signPage", signPage);
router.get("/addpost", addpostPage);
router.post("/sign", imageUpload, adduser);

router.post("/createPost", imageUpload, addPost);

router.post("/like",like)
router.post("/comment",comment)

router.get("/logout",logout);

router.get("/forgotPage",forgotPage);
router.post("/forgot",forgotcheck);
router.post("/changePassword",changePassword);
router.post("/verify",verify);
module.exports = router;
