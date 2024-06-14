const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function predictImage(imagePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    try {
        const response = await axios.post('https://trashcan-qnitsxbfya-et.a.run.app/predict', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to predict image: ${error.message}`);
    }
}

module.exports = predictImage;