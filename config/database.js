const mongoose = require("mongoose");

const dataBase = async (req, res) => {
  try {
    await mongoose.connect('mongodb+srv://abdullahvora136:insta123@cluster0.5ylfevt.mongodb.net/Instagram');
    console.log("DataBase connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dataBase