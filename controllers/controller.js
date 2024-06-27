const { default: mongoose } = require("mongoose");
const { userModel, postModel } = require("../models/model");
const multer = require("multer");
const mailer = require("nodemailer");

const home = async (req, res) => {
  try {
    let userDataGet = req.user;
    let userfind = await userModel.findOne({ email: userDataGet.email });
    console.log("user: " + userfind);
    let postfind = await postModel.find();
    await res.render("home", { userfind, postfind });
  } catch (error) {
    console.log(error);
  }
};
const loginPage = async (req, res) => {
  try {
    await res.render("login");
  } catch (error) {
    console.log(error);
  }
};

const signPage = async (req, res) => {
  try {
    await res.render("signIn");
  } catch (error) {
    console.log(error);
  }
};

const imageMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageUpload = multer({ storage: imageMulter }).single("image");

const adduser = async (req, res) => {
  try {
    let image = "";
    let size = 5 * 1024 * 1024;
    let file = req.file;
    if (file) {
      if (file.size < size) {
        image = req.file.path;
        console.log(image);
      } else {
        console.log("image less than 5MB");
      }
    } else {
      console.log("No image uploaded");
    }

    let addData = await userModel.create({
      username: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      image: image,
    });

    console.log(addData);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while adding the user.");
  }
};

const addpostPage = async (req, res) => {
  try {
    let userDataGet = req.user;
    let postfind = await postModel.find();
    let userfind = await userModel.findOne({ email: userDataGet.email });
    await res.render("addPost", { userfind, postfind });
  } catch (error) {
    console.log(error);
  }
};

const addPost = async (req, res) => {
  try {
    let image = "";
    let size = 5 * 1024 * 1024;
    let file = req.file;
    if (file) {
      if (file.size < size) {
        image = req.file.path;
        console.log(image);
      } else {
        console.log("image less than 5MB");
      }
    } else {
      console.log("No image uploaded");
    }

    let postData = await postModel.create({
      title: req.body.title,
      content: req.body.content,
      image: image,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const like = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.like += 1;
    await post.save();
    res.redirect("back");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const comment = async (req, res) => {
  try {
    let id = req.body.id;
    console.log(id);
    let commentget = req.body.comment;
    let commentadd = await postModel.findByIdAndUpdate(id, {
      comment: commentget,
    });
    console.log(commentadd);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    console.log("Log Out Successful...");
    req.logOut((err) => {
      if (err) console.log(err);
    });
    res.redirect("/loginPage");
  } catch (error) {
    console.log(error);
  }
};

const forgotPage = async (req, res) => {
  try {
    await res.render("forgot");
  } catch (error) {
    console.log(error);
  }
};

let otp = Math.floor(100000 + Math.random() * 900000);

const forgotcheck = async (req, res) => {
  try {
    let mail = req.body.email;
    let checkmail = await userModel.findOne({ email: mail });
    if (checkmail) {
      const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
          user: "abdullahvora136@gmail.com",
          pass: "uvaz hkcr zrrs elyk",
        },
      });
      const sendMail = {
        from: "abdullahvora136@gmail.com",
        to: mail,
        subject: "Reser Password OTP",
        html: `<span>${otp}</span>`,
      };

      transporter.sendMail(sendMail, (err, info) => {
        if (err) console.log(err);
        else console.log(info);
      });
      res.render("otp");
    } else {
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res) => {
  try {
    let otpcheck =
      req.body.otp1 +
      req.body.otp2 +
      req.body.otp3 +
      req.body.otp4 +
      req.body.otp5 +
      req.body.otp6;
    console.log(otpcheck);
    if (otpcheck == otp) {
      res.render("changepassword");
    } else {
      res.redirect("/forgotPage");
    }
  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (req, res) => {
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let confirmPassword = req.body.confirmPassword;
  let checkPassword = await userModel.findOne({ password: oldPassword });
  // console.log(checkPassword);
  let id = checkPassword._id;
  // console.log(id);

  if (checkPassword) {
    if (checkPassword.password == newPassword) {
      console.log("Old Password and new Password are Same...");
      res.redirect("back");
    }
    if (newPassword == confirmPassword) {
      console.log(newPassword);
      let change = await userModel.findByIdAndUpdate(id, {
        password: newPassword,
      });
      // console.log(change);
      res.redirect("/loginPage");
    } else {
      console.log("New and confirm password are not matched..");
    }
  }
};

module.exports = {
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
};
