const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Service, Email } = require("../models/model");
const multiUpload = require("../helpers/multi-upload")
const multer = require("multer");
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
    const title = req.body.title_tm;
    const description = req.body.description_tm;
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
        }).then(async (service) => {
            await Email.findAll().then((emails) => {
                var array = [];
                emails.forEach((email) => { array.push(email.dataValues.email) });
                emailService.sendMail({
                    from: process.env.EMAIL_USER,
                    to: [],
                    bcc: array,
                    subject: `Täze hyzmat: ${title}`,
                    html: `<!DOCTYPE html>
                    <html lang="en">
                    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                    <head></head>
                    <body style="padding:40px 0;background-color:#f6f9fc;font-family:Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
                        <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%"
                            style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
                            <tr style="width:100%">
                                <td>
                                    <table style="padding:0 48px" align="center" border="0" cellPadding="0" cellSpacing="0"
                                        role="presentation" width="100%">
                                        <tbody>
                                            <tr>
                                                <td><img alt="TMCELL" src="https://tmcell.tm/static/media/logo.91ef484ec8983a3b9790.png"
                                                        width="200" height="57"
                                                        style="display:block;outline:none;border:none;text-decoration:none;text-align:center" />
                                                    <hr
                                                        style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                                                    <h2 style="line-height:24px;margin:16px 0;color:#48494d;text-align:center">
                                                        Täze hyzmat: ${title}</h2>
                                                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#48494d;text-align:left">
                                                        Salam!</p>
                                                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#48494d;text-align:left">
                                                    ${description}</p>
                                                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#48494d;text-align:left">
                                                        Giňişleýin tanyşmak üçin aşakdaky düwmä basyň:</p>
                                                    <a href="https://tmcell.tm/hyzmatlar/${service.id}" target="_blank"
                                                        style="background-color:#0063b9;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;p-x:10px;p-y:10px;line-height:100%;max-width:100%;padding:10px 10px"><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;mso-text-raise:15" hidden>&nbsp;</i><![endif]--></span><span
                                                            style="background-color:#0063b9;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;p-x:10px;p-y:10px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:7.5px">Ginişleýin</span><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                                                    </p>
                                                    <hr
                                                        style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                                                    <p style="font-size:12px;line-height:16px;margin:16px 0;color:#8898aa">TMCELL © 217
                                                        Oguzhan köçesi, Aşgabat şäheri, 744000</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    
                    </html>`,
                });
            });
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