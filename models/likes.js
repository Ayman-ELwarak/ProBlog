const mongoose = require("mongoose");

const likesSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
      require: true,
    },
    targetType: { type: String, required: true, enum: ["Post", "Comment"] },
  },
  { timestamps: true },
);

likesSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

const like = mongoose.model('Like', likesSchema);

module.exports = like;
