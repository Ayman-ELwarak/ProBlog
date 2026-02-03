const ImageKit = require('imagekit');
const AppError = require('../utils/APIError');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

class ImageKitService {
    static async uploadImage(file, folder, fileName) {
        try {
            const response = await imagekit.upload({
                file: file.buffer,
                fileName: fileName || `img_${Date.now()}`,
                folder: `/social_app/${folder}`, 
                useUniqueFileName: true
            });

            return {
                url: response.url,
                fileId: response.fileId
            };
        } catch (error) {
            throw new AppError(`Image Upload Failed: ${error.message}`, 500);
        }
    }


    static async deleteImage(fileId) {
        try {
            if (!fileId) return;
            await imagekit.deleteFile(fileId);
        } catch (error) {
            console.error('ImageKit Delete Error:', error.message);
        }
    }

    static getImageUrl(fileId, transformations = []) {
        return imagekit.url({
            path: fileId,
            transformation: transformations
        });
    }
}

module.exports = ImageKitService;