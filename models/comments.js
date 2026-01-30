const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, require: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: "" },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    likes: { type: Number, default: 0 },
    isEdited: {type: Boolean, default: false},
    editedAt: {type: Date}
  },
  { timestamps: true },
);
const comment = mongoose.model('Comment', commentSchema);

module.exports = comment;