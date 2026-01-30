const Comment = require("../models/comments");
const Post = require("../models/posts");
const User = require("../models/users");

const createComment = async (commentData, userId) => {
  const postId = await Post.findById(commentData.postId);
  if (!postId) {
    return null;
  }
  if (commentData.parentCommentId) {
    console.log(commentData.parentCommentId);
    const commentId = await Comment.findById(commentData.parentCommentId);
    if (!commentId) {
      return null;
    }
  }
  const comment = await Comment.create({ ...commentData, userId: userId });
  console.log(comment);
  return comment;
};

const getAllComments = async (postId, query, currentUserId) => {
  let { page = 1, limit = 10 } = query;
  page = Number(page);
  limit = Number(limit);
  let commentPromise;
  if (postId) {
    commentPromise = await Comment.find({ postId: postId }, { password: 0 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    commentPromise = await Comment.find({}, { password: 0 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  for (let i = 0; i < commentPromise.length; i++) {
    const userId = commentPromise[i].userId;

    commentPromise[i] = commentPromise[i].toObject
      ? commentPromise[i].toObject()
      : commentPromise[i];

    if (currentUserId === userId.toString()) {
      commentPromise[i]["isOwner"] = true;
    } else {
      commentPromise[i]["isOwner"] = false;
    }
  }

  const totalPromise = await Comment.countDocuments();
  const [comments, total] = await Promise.all([commentPromise, totalPromise]);
  const pagenation = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
  return { comments, pagenation };
};

const getCommentById = async (id, userId) => {
  let comment = await Comment.findById(id);
  if (!comment) {
    return null;
  }
  comment = comment.toObject ? comment.toObject() : comment;
  const authorId = comment.userId;
  if (authorId.toString() === userId.toString()) {
    comment["isOwner"] = true;
  } else {
    comment["isOwner"] = true;
  }
  return comment;
};

const updateComment = async (id, commentData, userId) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    return "not found";
  }
  const authorId = comment.userId;

  if (userId !== authorId.toString()) {
    return "can't update";
  }
  const updateComment = await Comment.findOneAndUpdate(
    { _id: id },
    { ...commentData, isEdited: true, editedAt: Date.now() },
    { new: true },
  );

  return updateComment;
};

const deleteComment = async (id, userId) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    return "not found";
  }
  const authorCommentId = comment.userId;
  const post = await Post.findById(comment.postId);

  const authorPostId = post.userId;

  if (
    userId !== authorCommentId.toString() &&
    userId !== authorPostId.toString()
  ) {
    return "can't Delete";
  }

  const deleteRecursive = async (commentId) => {
    const replies = await Comment.find({ parentCommentId: commentId });

    if (replies.length > 0) {
      for (let reply of replies) {
        await deleteRecursive(reply._id);
      }
    }
    return await Comment.findByIdAndDelete(commentId);
  };

  const deletedResult = await deleteRecursive(id);

  return deletedResult;
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
