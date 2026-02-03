const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "",
    },
    tags: { type: [String] },
    images: [
      {
        url: { type: String },
        fileId: { type: String },
      },
    ],
    published: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
