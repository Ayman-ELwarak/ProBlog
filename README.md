# Production-Ready Blog Server API

## Project Overview
This project is a robust, production-ready backend for a blogging platform built with Node.js and the MEAN stack architecture. It features a comprehensive comment system, user engagement tools, cloud-based image management, and secure authentication workflows. This server is designed to demonstrate advanced API design, MVC architecture, and integration with third-party services like ImageKit and Nodemailer.

---

## Core Features

### 1. Advanced Comments System
* **Nested Discussions**: Supports a hierarchical comment structure allowing users to reply to comments up to 3 levels deep.
* **Ownership Logic**: Implements strict authorization where only authors can edit comments, while both comment authors and post authors can delete them.
* **Engagement Tracking**: Tracks likes, edit status, and timestamps for every interaction.

### 2. Likes & Reactions
* **Polymorphic System**: A unified model handles likes for both Posts and Comments using a `targetType` enum.
* **Optimized Queries**: Uses compound indexing on `userId`, `targetType`, and `targetId` to ensure unique reactions and high performance.

### 3. Professional Email Integration
* **Automated Workflows**: Integrated with **Nodemailer** to handle user lifecycle emails.
* **Dynamic Templates**: Uses HTML templates for welcome emails, password reset instructions, and interaction notifications.

### 4. Media Management
* **Multer Middleware**: Handles multi-part form data with strict validation for file size (max 2MB–5MB) and mime-types (JPG, PNG, WebP).
* **ImageKit Integration**: Offloads storage to **ImageKit**, providing optimized URLs and on-the-fly image transformations.

### 5. Secure Password Reset
* **Token-Based Flow**: Implements a secure reset process using `crypto.randomBytes()` for token generation.
* **Expiration Logic**: Tokens are hashed before storage and set with a 15-minute expiration window to prevent misuse.

---

## Technical Architecture
The project follows the **MVC (Model-View-Controller)** pattern for scalability and maintainability:
* **Models**: Defines data structures for Users, Posts, Comments, Likes, and more using Mongoose.
* **Services**: Contains the core business logic and third-party integrations (Email, ImageKit).
* **Controllers**: Manages the request-response cycle and interfaces with services.
* **Routers**: Defines API endpoints and applies necessary middlewares.
* **Schemas**: Uses Joi for strict input validation before data reaches the controllers.

---

## Getting Started

### Prerequisites
* Node.js installed
* MongoDB instance (Local or Atlas)
* ImageKit account for media storage
* SMTP credentials (e.g., Gmail App Password)

### Installation
1. Clone the repository and navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
