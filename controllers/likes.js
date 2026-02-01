const likeService = require("../services/likes");
const APIError = require("../utils/APIError");

const toggleLike = async (req, res) => {
  const { targetType, targetId } = req.body;

  const like = await likeService.toggleLike(
    req.user.userId,
    targetType,
    targetId,
  );

  if (like === "post not found") {
    throw new APIError("Post Not Found");
  } else if (like === "comment not found") {
    throw new APIError("Comment Not Found");
  }

  if (like.removed) {
    res.status(201).json({ message: "Removed Like" });
  } else {
    res.status(201).json({ message: "Liked" });
  }
};

const getLikesCount = async (req, res) => {
  const { targetType, targetId } = req.query;

  console.log(targetType);
  const countLikes = await likeService.getLikesCount(targetType, targetId);

  if (countLikes === "post not found") {
    throw new APIError("Post Not Found");
  } else if (countLikes === "comment not found") {
    throw new APIError("Comment Not Found");
  }

  res.status(200).json({ success: true, data: { likesCount: countLikes } });
};

const isLikedByUser = async (req, res) => {
  const { targetType, targetId } = req.query;

  const checkLiked = await likeService.isLikedByUser(req.user.userId, targetType, targetId);

  if (checkLiked === "post not found") {
    throw new APIError("Post Not Found");
  } else if (checkLiked === "comment not found") {
    throw new APIError("Comment Not Found");
  }

  res.status(200).json({ success: true, data: { status: checkLiked } });
};
module.exports = { toggleLike, getLikesCount, isLikedByUser };
