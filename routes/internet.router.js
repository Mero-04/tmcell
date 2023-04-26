const express = require('express');
const { isAdmin, isInternet } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Internet } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Internet.findAndCountAll({ limit, offset }).then((internets) => {
        res.json({
            internets: internets.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: internets.count,
                pages: Math.ceil(internets.count / limit)
            }
        })
    })
})

router.post("/create", isAdmin, imageUpload.upload.single("internet_icon"), async (req, res) => {
    await Internet.create({
        title_tm: req.body.title_tm,
        short_desc_tm: req.body.short_desc_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        short_desc_en: req.body.short_desc_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        short_desc_ru: req.body.short_desc_ru,
        description_ru: req.body.description_ru,
        volume: req.body.volume,
        price: req.body.price,
        connect_USSD: req.body.connect_USSD,
        internet_icon: req.file.filename,
        checked: "1"
    }).then(() => {
        res.json({ success: "Internet nyrhnamasy üstünlikli goşuldy" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:internetId", isAdmin, async (req, res) => {
    await Internet.findOne({ where: { id: req.params.internetId } }).then((internet) => { res.json({ internet: internet }) })
});

router.post("/edit/:internetId", isAdmin, imageUpload.upload.single("internet_icon"), async (req, res) => {
    let img = req.body.internet_icon;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/internet/" + img, err => { console.log(err); })
    }
    await Internet.update({
        title_tm: req.body.title_tm,
        short_desc_tm: req.body.short_desc_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        short_desc_en: req.body.short_desc_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        short_desc_ru: req.body.short_desc_ru,
        description_ru: req.body.description_ru,
        volume: req.body.volume,
        price: req.body.price,
        checked: req.body.checked,
        internet_icon: img,
        connect_USSD: req.body.connect_USSD
    }, { where: { id: req.params.internetId } }).then(() => {
        res.json({ success: "Üstünlikli üýtgedildi" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:internetId", isAdmin, async (req, res) => {
    await Internet.findOne({ where: { id: req.params.internetId } }).then((internet) => {
        if (internet) {
            fs.unlink("./public/img/internet/" + internet.internet_icon, err => { })
            internet.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});



module.exports = router;