const express = require('express');
const { isAdmin, isTariff } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Tarif } = require("../models/model");
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
    await Tarif.findAndCountAll({ limit, offset }).then((tarifs) => {
        res.json({
            tarifs: tarifs.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: tarifs.count,
                pages: Math.ceil(tarifs.count / limit)
            }
        })
    })
})

router.post("/create", isAdmin, imageUpload.upload.single("tarif_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'tarif', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Tarif.create({
        title_tm: req.body.title_tm,
        short_desc_tm: req.body.short_desc_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        short_desc_en: req.body.short_desc_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        short_desc_ru: req.body.short_desc_ru,
        description_ru: req.body.description_ru,
        price: req.body.price,
        period: req.body.period,
        connect_USSD: req.body.connect_USSD,
        tarif_img: req.file.filename,
        checked: "1"
    }).then(() => {
        res.json({ success: "Nyrhnama üstünlikli goşuldy" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:tarifId", isAdmin, async (req, res) => {
    await Tarif.findOne({ where: { id: req.params.tarifId } }).then((tarif) => { res.json({ tarif: tarif }) })
});

router.post("/edit/:tarifId", isAdmin, imageUpload.upload.single("tarif_img"), async (req, res) => {
    let img = req.body.tarif_img;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/tarif/" + img, err => { console.log(err); })
        fs.unlink("/public/compress/tarif/" + img, err => { console.log(err); })

        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'tarif', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }

    await Tarif.update({
        title_tm: req.body.title_tm,
        short_desc_tm: req.body.short_desc_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        short_desc_en: req.body.short_desc_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        short_desc_ru: req.body.short_desc_ru,
        description_ru: req.body.description_ru,
        price: req.body.price,
        period: req.body.period,
        status: req.body.status,
        connect_USSD: req.body.connect_USSD,
        checked: req.body.checked,
        tarif_img: img
    }, { where: { id: req.params.tarifId } }).then(() => {
        res.json({ success: "Üstünlikli üytgedildi" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:tarifId", isAdmin, async (req, res) => {
    await Tarif.findOne({ where: { id: req.params.tarifId } }).then((tarif) => {
        if (tarif) {
            fs.unlink("./public/img/tarif/" + tarif.tarif_img, err => { })
            fs.unlink("./public/compress/tarif/" + tarif.tarif_img, err => { })
            tarif.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});



module.exports = router;