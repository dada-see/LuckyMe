const sanitizeHtml = require('sanitize-html');

const sanitizeOptions = {
    allowedTags: [],
    allowedAttributes: {}  
};

function sanitizeInput(input) {
    return sanitizeHtml(input, sanitizeOptions);
}

module.exports = sanitizeInput;