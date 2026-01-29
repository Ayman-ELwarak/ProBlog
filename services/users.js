const User = require("../models/users");
const APIError = require("../utils/APIError");

const util = require('util');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const jwtSign = util.promisify(jwt.sign);

const signUp = async (userData) => {
    const {email, password} = userData;
    // check email 
    const existEmail = await User.findOne({email: email});
    if(existEmail){
        throw new APIError("email already exist", 400);
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({ ...userData, password : hashPassword});
    return createdUser;
}

const signIn = async (userData) => {
    const {email, password} = userData;
    // check email 
    const user = await User.findOne({email: email});
    if(!user){
        throw new APIError("email or password not vaild", 400);
    }

    // compare passwords
    const correctPassword = await bcrypt.compare(password, user.password);
    if(!correctPassword){
        throw new APIError("email or password not vaild", 400);
    }

    const token = await jwtSign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1d'});

    return {token, user: { ...user.toObject(), createdAt: undefined, reatedAt: undefined, updatedAt: undefined, __v: undefined, password: undefined}};
}

const getAllUsers = async (query) => {
    let { page = 1, limit = 10 } = query;
    page = Number(page);
    limit = Number(limit);
    const usersPromise = await User.find({}, { password: 0 }).skip((page - 1) * limit).limit(limit);
    const totalPromise = await User.countDocuments();
    const [users, total] = await Promise.all([usersPromise, totalPromise]);
    const pagenation = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    }
    return {users, pagenation};
}

const getUserById = async (id) =>{
    const user = await User.findById(id);
     
    if(!user){
        return null;
    }
    return user;
} 

const updateUser = async (id, userData) =>{
    const updatedUser = await User.findOneAndUpdate({ _id: id }, userData, { new: true });
    
    if(!updatedUser){
        return null;
    }

    return updatedUser;
}

const deleteUser = async (id) =>{
    const deletedUser = await User.findOneAndDelete({_id: id});

    if(!deletedUser){
        return null;
    }
    return deletedUser;
}

module.exports = { signUp, signIn, getAllUsers, getUserById, updateUser, deleteUser};