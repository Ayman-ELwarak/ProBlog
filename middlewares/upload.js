const multer = require('multer');
const APIError = require("../utils/APIError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new APIError('Invalid file type. Only JPG, PNG, and WebP are allowed!', 400), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

const uploadConfigs = {
    profile: upload.single('profilePic'),
    posts: upload.array('postImages', 5) 
};

module.exports = uploadConfigs;