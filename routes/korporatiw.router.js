const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Korporatiw,Email } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")
const emailService = require("../helpers/send-mail");

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Korporatiw.findAndCountAll({ limit, offset }).then((korporatiws) => {
        res.json({
            korporatiws: korporatiws.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: korporatiws.count,
                pages: Math.ceil(korporatiws.count / limit)
            }
        })
    })
})

router.post("/create", isAdmin, imageUpload.upload.single("korporatiw_icon"), async (req, res) => {
    const title = req.body.title_tm;
    const description = req.body.description_tm;
    await Korporatiw.create({
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
        korporatiw_icon: req.file.filename,
        connect_USSD: req.body.connect_USSD,
        checked: "1"
    }).then(async () => {
        await Email.findAll().then((emails) => {
            var array = [];
            emails.forEach((email) => { array.push(email.dataValues.email) });
            emailService.sendMail({
                from: process.env.EMAIL_USER,
                to: array,
                subject: title,
                html: description,
            });
        });
    }).then(() => { res.json({ success: "Korporatiw nyrhnama üstünlikli goşuldy" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:korporatiwId", isAdmin, async (req, res) => {
    await Korporatiw.findOne({
        where: { id: req.params.korporatiwId }
    }).then((korporatiw) => { res.json({ korporatiw: korporatiw }) })
});

router.post("/edit/:korporatiwId", isAdmin, imageUpload.upload.single("korporatiw_icon"), async (req, res) => {
    let img = req.body.korporatiw_icon;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/korporatiw/" + img, err => { console.log(err); })
    }
    await Korporatiw.update({
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
        checked: req.body.checked,
        korporatiw_icon: img,
        connect_USSD: req.body.connect_USSD
    }, { where: { id: req.params.korporatiwId } }).then(() => {
        res.json({ success: "Üstünlikli üýtgedildi" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:korporatiwId", isAdmin, async (req, res) => {
    await Korporatiw.findOne({ where: { id: req.params.korporatiwId } }).then((korporatiw) => {
        if (korporatiw) {
            fs.unlink("./public/img/korporatiw/" + korporatiw.korporatiw_icon, err => { })
            korporatiw.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});



module.exports = router;