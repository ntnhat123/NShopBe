const mongoose = require("mongoose");

const MONGO_URL = "mongodb+srv://nhatnguyentk2:nhat12345678@cluster0.gjp3dnc.mongodb.net/NShop?retryWrites=true&w=majority&appName=Cluster0";

const connectToDatabase = async () => {
  try {
      let connecting = await mongoose.connect(MONGO_URL)
      console.log("Connect to database success")
      return connecting
  } catch (error) {
      console.log(error)
  }
}

module.exports = { connectToDatabase };
