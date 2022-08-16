const { ocrSpace } = require('ocr-space-api-wrapper');

let readPdf = async (image, callback) => {
    try {
        // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
        console.log('image-----------', image);
        let text = await ocrSpace(image);
        console.log("text-----------", text);
        callback({ 'error': false, 'text': text.ParsedResults[0].ParsedText });

        // // Using your personal API key + local file
        // const res2 = await ocrSpace('/path/to/file.pdf', { apiKey: '<API_KEY_HERE>' });
        // // Using your personal API key + base64 image + custom language
        // const res3 = await ocrSpace('data:image/png;base64...', { apiKey: '<API_KEY_HERE>', language: 'ita' });
    } catch (error) {
        callback({ 'error': true, 'text': error });
        console.error(error);
        res.send(error);
    }
}

module.exports = {
    readPdf: readPdf,
} 