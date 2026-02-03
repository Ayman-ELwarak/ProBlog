const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/email");

class EmailService {
  static #getTemplate(templateName, placeholders) {
    const filePath = path.join(
      __dirname,
      `../templates/emails/${templateName}.html`,
    );
    let html = fs.readFileSync(filePath, "utf-8");

    Object.keys(placeholders).forEach((key) => {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), placeholders[key]);
    });

    return html;
  }

  static async sendWelcomeEmail(user) {
    const html = this.#getTemplate("welcome", {
      name: user.name,
      appURL: process.env.FRONTEND_URL,
    });

    const options = {
      email: user.email,
      subject: "Welcome to Our Social App! 🚀",
      html,
    };

    await sendEmail(options);
  }

  static async sendPasswordResetEmail(user, resetToken) {
    const html = this.#getTemplate("passwordReset", {
      name: user.name,
      resetToken: resetToken,
    });

    await sendEmail({
      email: user.email,
      subject: "Your password Reset Link (Valid for 10 mins)",
      html,
    });
  }

  static async sendPasswordResetConfirmation(user) {
    const html = this.#getTemplate("passwordResetConfirmation", {
      name: user.name,
      date: new Date().toLocaleString(),
    });

    await sendEmail({
      email: user.email,
      subject: "Your password has been changed 🛡️",
      html,
    });
  }
  static async sendCommentNotification(postOwner, commenterName, postTitle) {
    const html = this.#getTemplate("commentNotification", {
      name: postOwner.name,
      commenterName: commenterName,
      postTitle: postTitle || "your post",
    });

    await sendEmail({
      email: postOwner.email,
      subject: `💬 ${commenterName} commented on your post`,
      html,
    });
  }
  static async sendReplyNotification(commentOwner, originalComment, replierName, commentText) {
    const html = this.#getTemplate("replyNotification", {
      name: commentOwner.name,
      originalComment: originalComment,
      replierName: replierName,
      commentPreview: commentText.substring(0, 50) + "...",
      postURL: `${process.env.FRONTEND_URL}/notifications`,
    });

    await sendEmail({
      email: commentOwner.email,
      subject: `↪️ ${replierName} replied to your comment`,
      html,
    });
  }
}

module.exports = EmailService;
