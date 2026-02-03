const CommentService = require("../services/comments");
const EmailService = require("../services/email");
const PostService = require("../services/posts");
const UserService = require("../services/users");
const APIError = require("../utils/APIError");

const createComment = async (req, res) => {
  const comment = await CommentService.createComment(req.body, req.user.userId);
  if (!comment) {
    throw new APIError("Error !!!");
  }

  const user = await UserService.getUserById(req.user.userId);
  const commenterName = user.name;

  if (req.body.parentCommentId) {
    console.log(req.body.parentCommentId);
    const parentComment = await CommentService.getCommentById(req.body.parentCommentId, req.user.userId);
    const commentOwner = await UserService.getUserById(parentComment.userId);
    await EmailService.sendReplyNotification(commentOwner, parentComment.content, commenterName, req.body.content);
  } else {
    const post = await PostService.getPostById(req.body.postId);
    const postOwner = await UserService.getUserById(post.userId);
    await EmailService.sendCommentNotification(
      postOwner,
      commenterName,
      req.body.content,
    );
  }

  res.status(201).json({ message: "successfully", data: comment });
};

const getAllComments = async (req, res) => {
  const { postId } = req.query;
  const { comments, pagenation } = await CommentService.getAllComments(
    postId,
    req.query,
    req.user.userId,
  );
  res.json({
    message: "Comments fetched successfully",
    data: comments,
    pagenation: pagenation,
  });
};

const getCommentById = async (req, res) => {
  const { id } = req.params;
  const comment = await CommentService.getCommentById(id, req.user.userId);
  if (!comment) {
    throw new APIError("Comment not found", 404);
  }
  res.status(200).json({
    Comment: comment,
  });
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const comment = await CommentService.updateComment(
    id,
    req.body,
    req.user.userId,
  );
  if (comment === "not found") {
    throw new APIError("Comment not found", 404);
  } else if (comment == "can't update") {
    throw new APIError("Can't Update", 404);
  }
  res.json({
    message: "Comment Updated Successfully !",
    Comment: comment,
  });
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const comment = await CommentService.deleteComment(id, req.user.userId);
  if (comment === "not found") {
    throw new APIError("Comment not found", 404);
  } else if (comment == "can't update") {
    throw new APIError("Can't Delete", 404);
  }
  res.json({
    message: "Comment Deleted Successfully !",
    Comment: comment,
  });
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
