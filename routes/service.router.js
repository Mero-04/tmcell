const express = require('express');
const { isAdmin, isService } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Service } = require("../models/model");
const multiUpload = require("../helpers/multi-upload")
const multer = require("multer");
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Service.findAndCountAll({ limit, offset }).then((services) => {
        res.json({
            services: services.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: services.count,
                pages: Math.ceil(services.count / limit)
            }
        })
    })
})

router.post("/create", isAdmin, multiUpload.upload, async (req, res) => {
    if (req.files.service_img && req.files.service_icon) {
        let compresedImage = path.join(__dirname, "../", "public", "compress", "service", path.parse(req.files.service_img[0].fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.files.service_img[0].originalname));
        await sharp(req.files.service_img[0].path).jpeg({
            quality: 30,
            chromaSubsampling: "4:4:4",
        }).toFile(compresedImage);

        await Service.create({
            title_tm: req.body.title_tm,
            short_desc_tm: req.body.short_desc_tm,
            description_tm: req.body.description_tm,
            title_en: req.body.title_en,
            short_desc_en: req.body.short_desc_en,
            description_en: req.body.description_en,
            title_ru: req.body.title_ru,
            short_desc_ru: req.body.short_desc_ru,
            description_ru: req.body.description_ru,
            connect_USSD: req.body.connect_USSD,
            service_img: req.files.service_img[0].filename,
            service_icon: req.files.service_icon[0].filename,
            checked: "1",
        }).then(() => { res.json({ success: "Hyzmat üstünlikli goşuldy" }) })
            .catch((error) => { res.status(500).json({ error: error }) })

    } else if (req.files.service_img) {

        let compresedImage = path.join(__dirname, "../", "public", "compress", "service", path.parse(req.files.service_img[0].fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.files.service_img[0].originalname));
        await sharp(req.files.service_img[0].path).jpeg({
            quality: 30,
            chromaSubsampling: "4:4:4",
        }).toFile(compresedImage);

        await Service.create({
            title_tm: req.body.title_tm,
            short_desc_tm: req.body.short_desc_tm,
            description_tm: req.body.description_tm,
            title_en: req.body.title_en,
            short_desc_en: req.body.short_desc_en,
            description_en: req.body.description_en,
            title_ru: req.body.title_ru,
            short_desc_ru: req.body.short_desc_ru,
            description_ru: req.body.description_ru,
            connect_USSD: req.body.connect_USSD,
            service_img: req.files.service_img[0].filename,
            checked: "1",
        }).then(() => {
            res.json({ success: "Hyzmat üstünlikli goşuldy" })
        }).catch((error) => { res.status(500).json({ error: error }) })

    } else if (req.files.service_icon) {

        await Service.create({
            title_tm: req.body.title_tm,
            short_desc_tm: req.body.short_desc_tm,
            description_tm: req.body.description_tm,
            title_en: req.body.title_en,
            short_desc_en: req.body.short_desc_en,
            description_en: req.body.description_en,
            title_ru: req.body.title_ru,
            short_desc_ru: req.body.short_desc_ru,
            description_ru: req.body.description_ru,
            connect_USSD: req.body.connect_USSD,
            service_icon: req.files.service_icon[0].filename,
            checked: "1",
        }).then(() => {
            res.json({ success: "Hyzmat üstünlikli goşuldy" });
        }).catch((error) => { res.status(500).json({ error: error }) })
    } else {
        await Service.create({
            title_tm: req.body.title_tm,
            short_desc_tm: req.body.short_desc_tm,
            description_tm: req.body.description_tm,
            title_en: req.body.title_en,
            short_desc_en: req.body.short_desc_en,
            description_en: req.body.description_en,
            title_ru: req.body.title_ru,
            short_desc_ru: req.body.short_desc_ru,
            description_ru: req.body.description_ru,
            connect_USSD: req.body.connect_USSD,
            checked: "1",
        }).then(() => {
            res.json({ success: "Hyzmat üstünlikli goşuldy" });
        }).catch((error) => { res.status(500).json({ error: error }) })
    }

});

router.get("/edit/:serviceId", isAdmin, async (req, res) => {
    await Service.findOne({
        where: { id: req.params.serviceId }
    }).then((service) => {
        res.json({ service: service })
    })
});

router.post("/edit/:serviceId", isAdmin, multiUpload.upload, async (req, res) => {
    const current = await Service.findOne({ where: { id: req.params.serviceId } });
    let img = req.body.service_img;
    let icon = req.body.service_icon;
    if (req.files.service_img && req.files.service_icon) {
        fs.unlink("/public/img/service/" + current.service_img, err => { console.log(err); })
        fs.unlink("/public/compress/service_icon/" + current.service_icon, err => { console.log(err); })
        img = req.files.service_img[0].filename;
        icon = req.files.service_icon[0].filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'service', path.parse(req.files.service_img[0].fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.files.service_icon[0].originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
        await Service.update({
            title_tm: req.body.title_tm,
            short_desc_tm: req.body.short_desc_tm,
            description_tm: req.body.description_tm,
            title_en: req.body.title_en,
            short_desc_en: req.body.short_desc_en,
            description_en: req.body.description_en,
            title_ru: req.body.title_ru,
            short_desc_ru: req.body.short_desc_ru,
            description_ru: req.body.description_ru,
            checked: req.body.checked,
            service_img: img,
            connect_USSD: req.body.connect_USSD,
            service_icon: icon
        }, { where: { id: req.params.serviceId } }).then(() => {
            res.json({ success: "Üstünlikli üytgedildi" })
        }).catch((error) => { res.status(500).json({ error: error }) })

    } else if (req.files.service_img) {

        fs.unlink("/public/img/service/" + current.service_img, err => { console.log(err); })
        img = req.files.service_img[0].filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'service', path.parse(req.files.service_img[0].fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.files.service_icon[0].originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
        await Service.update({
            title_tm: req.body.title_tm,
            short_desc_tm: req.body.short_desc_tm,
            description_tm: req.body.description_tm,
            title_en: req.body.title_en,
            short_desc_en: req.body.short_desc_en,
            description_en: req.body.description_en,
            title_ru: req.body.title_ru,
            short_desc_ru: req.body.short_desc_ru,
            description_ru: req.body.description_ru,
            checked: req.body.checked,
            connect_USSD: req.body.connect_USSD,
            service_img: img
        }, { where: { id: req.params.serviceId } }).then(() => {
            res.json({ success: "Üstünlikli üýtgedildi" })
        }).catch((error) => { res.status(500).json({ error: error }) })

    } else if (req.files.service_icon) {
        fs.unlink("/public/compress/service_icon/" + current.service_icon, err => { console.log(err); })
        icon = req.files.service_icon[0].filename;

        await Service.update({
            title_tm: req.body.title_tm,
            short_desc_tm: req.body.short_desc_tm,
            description_tm: req.body.description_tm,
            title_en: req.body.title_en,
            short_desc_en: req.body.short_desc_en,
            description_en: req.body.description_en,
            title_ru: req.body.title_ru,
            short_desc_ru: req.body.short_desc_ru,
            description_ru: req.body.description_ru,
            checked: req.body.checked,
            connect_USSD: req.body.connect_USSD,
            service_icon: icon
        }, { where: { id: req.params.serviceId } }).then(() => {
            res.json({ success: "Üstünlikli üýtgedildi" })
        }).catch((error) => { res.status(500).json({ error: error }) })

    } else {
        await Service.update({
            title_tm: req.body.title_tm,
            short_desc_tm: req.body.short_desc_tm,
            description_tm: req.body.description_tm,
            title_en: req.body.title_en,
            short_desc_en: req.body.short_desc_en,
            description_en: req.body.description_en,
            title_ru: req.body.title_ru,
            short_desc_ru: req.body.short_desc_ru,
            description_ru: req.body.description_ru,
            checked: req.body.checked,
            connect_USSD: req.body.connect_USSD,
            service_img: img,
            service_icon: icon
        }, { where: { id: req.params.serviceId } }).then(() => {
            res.json({ success: "Üstünlikli üýtgedildi" })
        }).catch((error) => { res.status(500).json({ error: error }) })
    }
});

router.delete("/delete/:serviceId", isAdmin, async (req, res) => {
    await Service.findOne({ where: { id: req.params.serviceId } }).then((service) => {
        if (service) {
            fs.unlink("./public/img/service_icon/" + service.service_icon, err => { })
            fs.unlink("./public/img/service/" + service.service_img, err => { })
            fs.unlink("./public/compress/service/" + service.service_img, err => { })
            service.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else {
            res.json({ error: "Tapylmady" })
        }
    })
});


module.exports = router;