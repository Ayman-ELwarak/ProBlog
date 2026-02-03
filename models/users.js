const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    age: { type: Number, required: true, min: 18, max: 150 },
    profilePicture: {
      url: { type: String, default: "" },
      fileId: { type: String, default: null },
    },
  },
  { timestamps: true },
);

// User Model
const User = mongoose.model("User", userSchema);
userSchema.index({ email: 1 }, { unique: true });

module.exports = User;
