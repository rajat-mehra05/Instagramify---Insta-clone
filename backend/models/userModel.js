const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/dxgo68vci/image/upload/v1619430791/no-user_rf6odv.png",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

module.exports = User = mongoose.model("User", userSchema);
