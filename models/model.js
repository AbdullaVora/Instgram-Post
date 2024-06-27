const { name } = require("ejs");
const mongoose = require("mongoose");
const { comment } = require("../controllers/controller");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  image: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  comment: { type: String, default: "" },
  like: { type: Number, default: 0 },
});

const userModel = mongoose.model("userLoginData", userSchema);
const postModel = mongoose.model("postData", postSchema);

module.exports = { userModel, postModel };
