const UserService = require("../services/users");
const APIError = require("../utils/APIError");

const signUp = async (req, res) => {
    const user = await UserService.signUp(req.body);
    res.status(201).json({ message: "User created successfully", data: user });
}

const signIn = async (req, res) => {
    const data = await UserService.signIn(req.body);
    res.status(200).json({ message: "Signed in successfully", data: data });
}

const getAllUsers = async (req, res) => {
    const {users, pagenation} = await UserService.getAllUsers(req.query);
    res.json({
        message: "Users fetched successfully", 
        data: users, 
        pagenation: pagenation
    })
}

const getUserById = async (req, res) =>{
    const {id} = req.params;
    const user = await UserService.getUserById(id);
    if(!user){
        throw new APIError("User not found", 404);
    }

    res.json({ message: "User fetched successfully", data: user });
}

const getUserLikes = async (req, res) => {
    const {userId} = req.params;
    const {likes, pagenation} = await UserService.getUserLikes(userId, req.query);

    if(!likes){
        throw new APIError('User Not Found');
    }

    res.status(200).json({data: likes, pagenation: pagenation});
}

const updateUser = async (req, res) => {
    const {id} = req.params;
    
    const updatedUser = await UserService.updateUser(id, req.body);
    if(!updatedUser){
        return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User updated successfully", data: updatedUser });
}

const deleteUser = async (req, res) =>{ 
    const {id} = req.params;

    const deletedUser = await UserService.deleteUser(id);

    if(!deletedUser){
        return res.status(404).json({ message: "User not found" })
    }

     res.json({ message: "User deleted successfully" });
}

module.exports = {signUp, signIn, getAllUsers, getUserById, getUserLikes, updateUser, deleteUser};