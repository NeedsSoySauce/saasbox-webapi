const cloudinary = require('cloudinary').v2;
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads the given text.
 *
 * @param {string} text The text to upload
 * @param {string} id Unique id for this upload
 * @returns {Promise<string>} URL where the uploaded text can be retrieved
 */
async function uploadText(text, id) {
    const public_id = `${id}.txt`;
    const data = parser.format('.txt', text).content;

    const response = await cloudinary.uploader.upload(data, {
        public_id,
        folder: 'items/',
        resource_type: 'raw',
        type: 'private'
    });

    const signature = cloudinary.utils.api_sign_request(
        { public_id: response.public_id, version: response.version },
        process.env.CLOUDINARY_API_SECRET
    );

    if (signature !== response.signature) {
        await cloudinary.uploader.destroy(public_id);
        return {
            statusCode: 500
        };
    }

    return response.secure_url;
}

module.exports = {
    uploadText
};
