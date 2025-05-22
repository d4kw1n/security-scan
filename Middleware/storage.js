const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/banner');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + getFileExtension(file.originalname));
    },
});

const getFileExtension = (filename) => {
    return '.' + filename.split('.').pop();
};

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.png'];

    const fileExtension = getFileExtension(file.originalname);
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
