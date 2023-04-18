const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Sponsor } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
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
    await Sponsor.findAndCountAll({ limit, offset }).then((sponsors) => {
        res.json({
            sponsors: sponsors.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: sponsors.count,
                pages: Math.ceil(sponsors.count / limit)
            }
        })
    })
})

router.post("/create", isAdmin, imageUpload.upload.single("sponsor_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'sponsor', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Sponsor.create({
        title: req.body.title,
        title_en: req.body.title_en,
        title_ru: req.body.title_ru,
        link: req.body.link,
        sponsor_img: req.file.filename,
        checked: "1"
    }).then(() => { res.json({ success: "Ustinlikli gosuldy" }) })
        .catch((error) => { res.json({ error: error }) })
});

router.get("/edit/:sponsorId", isAdmin, async (req, res) => {
    await Sponsor.findOne({ where: { id: req.params.sponsorId } }).then((sponsor) => { res.json({ sponsor: sponsor }) })
});

router.post("/edit/:sponsorId", isAdmin, imageUpload.upload.single("sponsor_img"), async (req, res) => {
    let img = req.body.sponsor_img;
    if (req.file) {
        fs.unlink("/public/img/sponsor/" + img, err => { console.log(err); })
        fs.unlink("/public/compress/sponsor/" + img, err => { console.log(err); })
        img = req.file.filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'sponsor', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }
    await Sponsor.update({
        title: req.body.title,
        title_en: req.body.title_en,
        title_ru: req.body.title_ru,
        link: req.body.link,
        sponsor_img: img,
        checked: req.body.checked,
    }, { where: { id: req.params.sponsorId } })
        .then(() => { res.json({ success: "Ustunlikli uytgedildi" }) })
        .catch((error) => { res.json({ error: error }) })
});

router.delete("/delete/:sponsorId", isAdmin, async (req, res) => {
    await Sponsor.findOne({ where: { id: req.params.sponsorId } }).then((sponsor) => {
        if (sponsor) {
            fs.unlink("./public/img/sponsor/" + sponsor.sponsor_img, err => { })
            fs.unlink("./public/compress/sponsor/" + sponsor.sponsor_img, err => { })
            sponsor.destroy()
            return res.json({ success: "Ustunlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});




module.exports = router;