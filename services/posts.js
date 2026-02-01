const Post = require('../models/posts');
const Comment = require('../models/comments');
const Like = require('../models/likes');
const User = require('../models/users');


const createPost = async (postData, authorId) => {
    const post = await Post.create({...postData, userId: authorId});
    console.log(post);
    return post;
}

const getAllPosts = async (query, id) => {
    let { page = 1, limit = 10 } = query;
    page = Number(page);
    limit = Number(limit);
    const postsPromise = await Post.find({}, { password: 0 }).skip((page - 1) * limit).limit(limit);

    console.log(id);

    for(let i=0; i<postsPromise.length; i++){
        const userId = postsPromise[i].userId;
        const userData = await User.findById(userId);

        postsPromise[i] = postsPromise[i].toObject ? postsPromise[i].toObject() : postsPromise[i];

        const {_id, email} = userData;
        delete postsPromise[i].userId;
        postsPromise[i]['email'] = email;

        console.log(_id);

        if(id === _id.toString()){
           postsPromise[i]['isOwner'] = true; 
        }else{
            postsPromise[i]['isOwner'] = false;
        }
    }

    const totalPromise = await Post.countDocuments();
    const [posts, total] = await Promise.all([postsPromise, totalPromise]);
    const pagenation = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    }
    return {posts, pagenation};
}

const getPostById = async (id) =>{
    const post = await Post.findById(id);
     
    if(!post){
        return null;
    }
    return post;
} 

const getCommentByPostId = async (postId, userId) => {
  const post = Post.findById(postId);
  if (!post) {
    return null;
  }

  let comment = await Comment.find({ postId: postId });
  for (let i = 0; i < comment.length; i++) {
    comment[i] = comment[i].toObject ? comment[i].toObject() : comment[i];
    const authorId = comment[i].userId;
    if (authorId.toString() === userId.toString()) {
      comment[i]["isOwner"] = true;
    } else {
      comment[i]["isOwner"] = true;
    }
  }
  return comment;
};

const updatePost = async (id, postData) =>{
    const updatedPost = await Post.findOneAndUpdate({ _id: id }, postData, { new: true });
    
    if(!updatedPost){
        return null;
    }

    return updatedPost;
}

const deletePost = async (id) => {
    // check post found or not
    const post = await Post.findById(id);
    if(!post){
        return null;
    }

    const postComments = await Comment.find({ postId: id }).select('_id');
    const commentIds = postComments.map(comment => comment._id);

    if (commentIds.length > 0) {
        await Like.deleteMany({ 
            targetId: { $in: commentIds }, 
            targetType: 'Comment' 
        });
    }

    await Comment.deleteMany({ postId: id });

    await Like.deleteMany({ 
        targetId: id, 
        targetType: 'Post' 
    });

    const deletedPost = await Post.findOneAndDelete({ _id: id });

    if (!deletedPost) {
        return null;
    }

    return deletedPost;
}

module.exports = { createPost, getAllPosts, getPostById, getCommentByPostId, updatePost, deletePost};