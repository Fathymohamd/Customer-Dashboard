const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  Email: String,
  Telephone: String,
  Age: Number,
  Country: String,
  Gender: String,
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
} , {timestamps : true});

const Customer  = mongoose.model("Customer", userSchema);
module.exports = Customer ;


