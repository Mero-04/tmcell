const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Galery } = require("../models/model");
const imageUpload = require("../helpers/galery-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Galery.findAndCountAll({ limit, offset }).then((images) => {
        res.json({
            images: images.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: images.count,
                pages: Math.ceil(images.count / limit)
            }
        })
    })
})

router.post("/create", isAdmin, imageUpload.upload.single("galery_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'galery', path.parse(req.file.fieldname).name + "_" + path.parse(req.file.originalname).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Galery.create({
        galery_img: req.file.filename,
        checked: "1"
    }).then(() => { res.json({ success: "Surat üstünlikli goşuldy" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:imageId", isAdmin, async (req, res) => {
    await Galery.findOne({ where: { id: req.params.imageId } }).then((image) => { res.json({ image: image }) })
});

router.post("/edit/:imageId", isAdmin, imageUpload.upload.single("galery_img"), async (req, res) => {
    const current = await Galery.findOne({ where: { id: req.params.imageId } });
    let img = req.body.galery_img;
    if (req.file) {
        fs.unlink("./public/img/galery/" + current.galery_img, err => { console.log(err); })
        fs.unlink("./public/compress/galery/" + current.galery_img, err => { console.log(err); })
        img = req.file.filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'galery', path.parse(req.file.fieldname).name + "_" + path.parse(req.file.originalname).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }
    await Galery.update({
        galery_img: img,
        checked: req.body.checked,
    }, { where: { id: req.params.imageId } })
        .then(() => { res.json({ success: "Üstünlikli üýtgedildi" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:imageId", isAdmin, async (req, res) => {
    await Galery.findOne({ where: { id: req.params.imageId } }).then((image) => {
        if (image) {
            fs.unlink("./public/img/galery/" + image.galery_img, err => { })
            fs.unlink("./public/compress/galery/" + image.galery_img, err => { })
            image.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});


module.exports = router;