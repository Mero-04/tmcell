const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if (file.fieldname === "service_img") {
            cb(null, './public/img/service/');
        }
        else if (file.fieldname === "service_icon") {
            cb(null, './public/img/service_icon/');
        }
     },
        
    filename: function(req, file, cb){
        cb(null, path.parse(file.fieldname).name + "_" +  path.parse(req.body.title_tm).name + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).fields([
    { name: 'service_img', maxCount: 1 }, 
    { name: 'service_icon', maxCount: 1 }
]);

module.exports.upload = upload;