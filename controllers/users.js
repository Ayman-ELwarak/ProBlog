const UserService = require("../services/users");
const EmailService = require("../services/email");
const APIError = require("../utils/APIError");
const ImageKitService = require("../services/imageKit");
const PassowrdResetService = require("../services/passwordReset");
const User = require("../models/users");
const bcrypt = require("bcrypt");


const signUp = async (req, res) => {
  const user = await UserService.signUp(req.body);
  await EmailService.sendWelcomeEmail(user).catch((err) => {
    console.error("Email failed to send:", err);
  });
  res.status(201).json({ message: "User created successfully", data: user });
};

const signIn = async (req, res) => {
  const data = await UserService.signIn(req.body);
  res.status(200).json({ message: "Signed in successfully", data: data });
};

const updateProfilePicture = async (req, res) => {
  if (!req.file) {
    throw new APIError("Please upload an image!", 400);
  }

  const uploadResult = await ImageKitService.uploadImage(
    req.file,
    "profiles",
    `user_${req.user.userId}_${Date.now()}`,
  );

  if (req.user.profilePicture && req.user.profilePicture.fileId) {
    ImageKitService.deleteImage(req.user.profilePicture.fileId);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.userId,
    {
      profilePicture: {
        url: uploadResult.url,
        fileId: uploadResult.fileId,
      },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    status: "success",
    message: "Profile picture updated successfully",
    data: {
      user: updatedUser,
    },
  });
};

const deleteProfilePicture = async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user.profilePicture.fileId) {
    console.log(user.profilePicture.fileId);
    throw new APIError("There is no profile picture to delete.", 404);
  }

  await ImageKitService.deleteImage(user.profilePicture.fileId);

  user.profilePicture = { url: "", fileId: null };
  await user.save();

  res.status(200).json({
    status: "success",
    message: "The profile image deleted successfully",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError("There is no user with that email address.", 404);
  }

  const resetToken = await PassowrdResetService.generateResetToken();
  await PassowrdResetService.saveResetToken(user._id, resetToken);

  await EmailService.sendPasswordResetEmail(user, resetToken);
  res.status(200).json({
    status: "success",
    message: "Token sent to email",
  });
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!password) {
    throw new APIError("Please provide a new password", 400);
  }

  const user = await PassowrdResetService.resetPassword(token, password);

  if (!user) {
    throw new APIError("Token is invalid or has expired", 400);
  }

  await EmailService.sendPasswordResetConfirmation(user);

  res.status(200).json({
    status: "success",
    message: "Password reset Successful, Confirmaion email sent.",
  });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new APIError("Please provide current and new password", 400);
  }

  const user = await UserService.getUserById(req.user.userId);

  const correctPassword = await bcrypt.compare(currentPassword, user.password);

  if (!correctPassword) {
    throw new APIError("Current password is incorrect", 401);
  }

  const hashPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashPassword;

  user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
};

const getAllUsers = async (req, res) => {
  const { users, pagenation } = await UserService.getAllUsers(req.query);
  res.json({
    message: "Users fetched successfully",
    data: users,
    pagenation: pagenation,
  });
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await UserService.getUserById(id);
  if (!user) {
    throw new APIError("User not found", 404);
  }

  res.json({ message: "User fetched successfully", data: user });
};

const getUserLikes = async (req, res) => {
  const { userId } = req.params;
  const { likes, pagenation } = await UserService.getUserLikes(
    userId,
    req.query,
  );

  if (!likes) {
    throw new APIError("User Not Found");
  }

  res.status(200).json({ data: likes, pagenation: pagenation });
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  const updatedUser = await UserService.updateUser(id, req.body);
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User updated successfully", data: updatedUser });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await UserService.deleteUser(id);

  if (!deletedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
};

module.exports = {
  signUp,
  signIn,
  updateProfilePicture,
  deleteProfilePicture,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllUsers,
  getUserById,
  getUserLikes,
  updateUser,
  deleteUser,
};
