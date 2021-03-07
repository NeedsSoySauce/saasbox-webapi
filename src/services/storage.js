const cloudinary = require('cloudinary').v2;
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class StorageService {
    createTextPublicId(id) {
        return `items/${id}.txt`;
    }

    /**
     * Uploads the given text.
     *
     * @param {string} text The text to upload
     * @param {string} id Unique id for this upload
     * @returns {Promise<string>} URL where this resource can be retrieved
     */
    async uploadText(text, id) {
        const public_id = this.createTextPublicId(id);
        const data = parser.format('.txt', text).content;

        const response = await cloudinary.uploader.upload(data, {
            public_id,
            resource_type: 'raw',
            type: 'private'
        });

        const signature = cloudinary.utils.api_sign_request(
            { public_id: response.public_id, version: response.version },
            process.env.CLOUDINARY_API_SECRET
        );

        if (signature !== response.signature) {
            await this.deleteText(id);
            console.error('Signature mismatch');
            throw new Error('Signature mismatch');
        }

        return response.secure_url;
    }

    /**
     * @param {string} id Id of the text to be removed
     */
    async deleteText(id) {
        const public_id = this.createTextPublicId(id);
        await cloudinary.uploader.destroy(public_id, {
            resource_type: 'raw',
            type: 'private'
        });
    }
}

module.exports = StorageService;
