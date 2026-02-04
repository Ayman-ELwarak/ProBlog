const crypto = require('crypto');
const User = require("../models/users");
const bcrypt = require("bcrypt");


const generateResetToken = async () => {
    return crypto.randomBytes(32).toString('hex');
}

const saveResetToken = async (userId, token) => {
    console.log(typeof token);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    await User.findByIdAndUpdate(userId, {
        passwordResetToken: hashedToken,
        passwordResetExpires: Date.now() + 15 * 60 * 1000
    });
}

const verifyResetToken = async (token) =>{
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    return user;
}

const resetPassword = async(token, newPassword) => {
    const user = await verifyResetToken(token);

    if(!user){
        return null;
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return user;
}

module.exports = {generateResetToken, saveResetToken, verifyResetToken, resetPassword};