const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require("helmet");
const { sanitizeMongoInput } = require("express-v5-mongo-sanitize");
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');

const userRouter = require('./routers/users');
const postRouter = require('./routers/posts');
const commentRouter = require('./routers/comments');
const errorHandler = require('./middlewares/errorHandler');


require('dotenv').config();

const rateLimiter = require('./middlewares/rateLimiter');

const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.use(errorHandler);
app.use(cors());
app.use(helmet());
app.use(sanitizeMongoInput);
app.use(xss());
app.use(hpp());
app.use(rateLimiter);



const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
    mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log('Not Connected to MongoDB')
        console.log(err)
    });
    console.log('Server is running on Port:3000');
});