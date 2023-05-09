const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "galery_img") {
            cb(null, './public/img/galery/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, path.parse(file.fieldname).name + "_" + path.parse(file.originalname).name + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

module.exports.upload = upload;