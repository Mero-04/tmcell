const express = require('express');
const { isAdmin, isNews } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Popup } = require("../models/model");
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
    await Popup.findAndCountAll({ limit, offset }).then((popups) => {
        res.json({
            popups: popups.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: popups.count,
                pages: Math.ceil(popups.count / limit)
            }
        })
    })
})

router.post("/create", isAdmin, imageUpload.upload.single("popup_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'popup', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Popup.create({
        title_tm: req.body.title_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        description_ru: req.body.description_ru,
        link: req.body.link,
        popup_img: req.file.filename,
        checked: "1"
    }).then(() => { res.json({ success: "Popup üstünlikli goşuldy" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:popupId", isAdmin, async (req, res) => {
    await Popup.findOne({ where: { id: req.params.popupId } }).then((popup) => {
        res.json({ popup: popup })
    })
});

router.post("/edit/:popupId", isAdmin, imageUpload.upload.single("popup_img"), async (req, res) => {
    let img = req.body.popup_img;
    if (req.file) {
        fs.unlink("/public/img/popup/" + img, err => { console.log(err); })
        fs.unlink("/public/compress/popup/" + img, err => { console.log(err); })
        img = req.file.filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'popup', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }
    await Popup.update({
        title_tm: req.body.title_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        description_ru: req.body.description_ru,
        link: req.body.link,
        popup_img: img,
        checked: req.body.checked,
    }, { where: { id: req.params.popupId } })
        .then(() => { res.json({ success: "Üstünlikli üýtgedildi" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:popupId", isAdmin, async (req, res) => {
    await Popup.findOne({ where: { id: req.params.popupId } }).then((popup) => {
        if (popup) {
            fs.unlink("./public/img/popup/" + popup.popup_img, err => { })
            fs.unlink("./public/compress/popup/" + popup.popup_img, err => { })
            popup.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});



router.get("/worker/", isNews, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Popup.findAndCountAll({
        limit,
        offset,
        where: req.user.role == "Tazelik" ? { workerId: req.user.id } : null
    }).then((popups) => {
        res.json({
            popups: popups.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: popups.count,
                pages: Math.ceil(popups.count / limit)
            }
        })
    })
})

router.post("/worker/create", isNews, imageUpload.upload.single("popup_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'popup', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Popup.create({
        title_tm: req.body.title_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        description_ru: req.body.description_ru,
        link: req.body.link,
        popup_img: req.file.filename,
        checked: "1"
    }).then(() => { res.json({ success: "Popup üstünlikli goşuldy" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/worker/edit/:popupId", isNews, async (req, res) => {
    await Popup.findOne({
        where: { id: req.params.popupId, workerId: req.user.id }
    }).then((popup) => { res.json({ popup: popup }) })
});

router.post("/worker/edit/:popupId", isNews, imageUpload.upload.single("popup_img"), async (req, res) => {
    let img = req.body.popup_img;
    if (req.file) {
        fs.unlink("./public/img/popup/" + img, err => { console.log(err); })
        fs.unlink("./public/compress/popup/" + img, err => { console.log(err); })
        img = req.file.filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'popup', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }
    await Popup.update({
        title_tm: req.body.title_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        description_ru: req.body.description_ru,
        link: req.body.link,
        popup_img: img,
        checked: req.body.checked,
        workerId: req.user.id
    }, {
        where: {
            id: req.params.popupId,
            workerId: req.user.id
        }
    })
        .then(() => { res.json({ success: "Üstünlikli üýtgedildi" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});


router.delete("/worker/delete/:popupId", isNews, async (req, res) => {
    await Popup.findOne({ where: { id: req.params.popupId, workerId: req.user.id } }).then((popup) => {
        if (popup) {
            fs.unlink("./public/img/popup/" + popup.popup_img, err => { })
            fs.unlink("./public/compress/popup/" + popup.popup_img, err => { })
            popup.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});



module.exports = router;