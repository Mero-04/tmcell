const { deepStrictEqual } = require("assert");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "news_img") {
            cb(null, './public/img/news/');
        }
        else if (file.fieldname === "tarif_img") {
            cb(null, './public/img/tarif/');
        }
        else if (file.fieldname === "service_img") {
            cb(null, './public/img/service/');
        } 
        else if (file.fieldname === "program_img") {
            cb(null, './public/img/program/');
        } 
        else if (file.fieldname === "banner_img") {
            cb(null, './public/img/banner/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, path.parse(file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

module.exports.upload = upload;