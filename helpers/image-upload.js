const { deepStrictEqual } = require("assert");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if (file.fieldname === "news_img") {
            cb(null, './public/img/news/');
        }
        else if (file.fieldname === "internet_img") {
            cb(null, './public/img/internet/');
        }
        else if (file.fieldname === "tarif_img") {
            cb(null, './public/img/tarif/');
        }
        else if (file.fieldname === "service_img") {
            cb(null, './public/img/service/');
        }
        else if (file.fieldname === "korporatiw_img") {
            cb(null, './public/img/korporatiw/');
        }
     },
    filename: function(req, file, cb){
        cb(null, path.parse(file.originalname).name + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

module.exports.upload = upload;