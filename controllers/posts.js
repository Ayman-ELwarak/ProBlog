const PostService = require("../services/posts");
const UserService = require("../services/users");
const APIError = require("../utils/APIError");

const createPost = async (req, res) => {
    const post = await PostService.createPost(req.body, req.user.userId);
    res.status(201).json({ message: "Post created successfully", data: post })
}

const getAllPosts = async (req, res) => {
    const {posts, pagenation} = await PostService.getAllPosts(req.query, req.user.userId);
    res.json({
        message: "Posts fetched successfully", 
        data: posts, 
        pagenation: pagenation
    })
}

const getPostById = async (req, res) =>{
    const {id} = req.params;
    const post = await PostService.getPostById(id);
    if(!post){
        throw new APIError("Post not found", 404);
    }
    res.status(200).json({
        Post : post
    })
}

const getCommentByPostId = async (req, res) =>{
    const {postId} = req.params;
    const comments = await PostService.getCommentByPostId(postId, req.user.userId);
    if(!comments){
        throw new APIError("Post not found", 404);
    }
    res.status(200).json({
        Comment : comments
    })
}
const updatePost = async (req, res) => {
    const {id} = req.params;

    const author = await PostService.getPostById(id);
    if(!author){
        throw new APIError("Post not found", 404);
    }
    const authorId = author.userId;
    console.log(authorId);
    
    const userId = req.user.userId;
    console.log(userId);
    
    if(userId !== authorId.toString()){
        throw new APIError("Can't Update", 404);
    }

    const post = await PostService.updatePost(id, req.body);
    if(!post){
        throw new APIError("Post not found", 404);
    }
    res.json({
        message : "Post Updated Successfully !",
        post: post
    })
}

const deletePost = async (req, res) =>{ 
    const {id} = req.params;

    const author = await PostService.getPostById(id);
    if(!author){
        throw new APIError("Post not found", 404);
    }
    const authorId = author.userId;
    console.log(authorId);
    
    const userId = req.user.userId;
    console.log(userId);
    
    if(userId !== authorId.toString()){
        throw new APIError("Can't Delete", 404);
    }

    const deletedPost = await PostService.deletePost(id);

    if(!deletedPost){
        throw new APIError("Post not found", 404);
    }

    res.json({
        message : "Post Deleted Successfully !",
        post: deletedPost
    })
}

module.exports = {createPost, getAllPosts, getPostById, getCommentByPostId, updatePost, deletePost};