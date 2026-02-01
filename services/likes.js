const Like = require('../models/likes');
const User = require('../models/users');
const Post = require('../models/posts');
const Comment = require('../models/comments');

const toggleLike = async (userId, targetType, targetId) => {
    // check post or comment 
    if(targetType === 'Post'){
        const post = await Post.findById(targetId);
        if(!post){
            return 'post not found';
        }
    }else{
        const comment = await Comment.findById(targetId);
        if(!comment){
            return 'comment not found';
        }
    }

    // create or delete like
    const like = await Like.findOne({userId: userId, targetType: targetType, targetId: targetId});

    const Model = targetType === 'Post' ? Post : Comment;
    if(like){
        const DeletedLike = await Like.findOneAndDelete({userId: userId, targetType: targetType, targetId: targetId});
        await Model.findByIdAndUpdate({_id: targetId}, {$inc: {likes: -1}});
        return {...DeletedLike, "removed": true};
    }else{
        const createdLike = await Like.create({userId: userId, targetType: targetType, targetId: targetId});
        await Model.findByIdAndUpdate({_id: targetId}, {$inc: {likes: 1}}); 
        return {...createdLike, "removed": false};
    }
}

const getLikesCount = async (targetType, targetId) => {
    // check post or comment 
    if(targetType === 'Post'){
        const post = await Post.findById(targetId);
        if(!post){
            return 'post not found';
        }
    }else{
        const comment = await Comment.findById(targetId);
        if(!comment){
            return 'comment not found';
        }
    }

    // count number of likes
    const NumberOfLikes = await Like.countDocuments({targetId: targetId});

    return NumberOfLikes;
}

const isLikedByUser = async (userId, targetType, targetId) => {
    // check post or comment 
    if(targetType === 'Post'){
        const post = await Post.findById(targetId);
        if(!post){
            return 'post not found';
        }
    }else{
        const comment = await Comment.findById(targetId);
        if(!comment){
            return 'comment not found';
        }
    }

    // check if user liked or not

    const like = await Like.findOne({userId: userId, targetType: targetType, targetId: targetId});

    if(like){
        return true;
    }else{
        return false;
    }
}


module.exports = {toggleLike, getLikesCount, isLikedByUser}