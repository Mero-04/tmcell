const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Internet, Email } = require("../models/model");
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
    const title = req.body.title_tm;
    const description = req.body.description_tm;
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
    }).then(async (internet) => {
        await Email.findAll().then((emails) => {
            var array = [];
            emails.forEach((email) => { array.push(email.dataValues.email) });
            emailService.sendMail({
                from: process.env.EMAIL_USER,
                to: [],
                bcc: array,
                subject: title,
                html: `<style type="text/css">
                .how-work li:after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: -21px;
                    width: 2px;
                    height: 70%;
                    background-color: #7e7e7e;
                    transform: translateY(-50%);
                }
                .how-work li:first-child::after {
                    content: none;
                }
            </style>
            <div style="text-align: center !important; margin: 0 auto; width: 650px; font-family: 'Arial', sans-serif; display: block">
                <a href="https://tmcell.tm" style="text-decoration: none">
                    <img src="https://tmcell.tm/static/media/logo.91ef484ec8983a3b9790.png" class="main-logo" alt="logo" style="width: 250px; margin: 30px 0 20px" />
                </a>
                <div style="box-shadow: 0px 7px 29px 0px rgba(100, 100, 111, 0.2); -webkit-box-shadow: 0px 7px 29px 0px rgba(100, 100, 111, 0.2)">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-radius: 50px; background-color: white; width: 100%; padding: 30px 30px 50px">
                        <tbody>
                            <tr>
                                <td class="welcome-details" style="display: block; text-align: center !important">
                                    <h1>${title}</h1>
                                    <p style="font-weight: normal; font-size: 14px; color: #232323; line-height: 1.6; letter-spacing: 0.05em; margin: 0; text-align: justify" dangerouslySetInnerHTML={{ __html: ${description}}}></p>
                                    <a href="https://it.net.tm/tmcell/internet/${internet.id}" target="_blank" style="text-decoration: none; width: 100px; height: 22px; color: #fff; border-radius: 5px; padding: 10px 25px; font-family: 'Lato', sans-serif; font-weight: 500; cursor: pointer; position: relative; display: inline-block; box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1); outline: none; background: #0063b9; margin-top: 20px; border: none">Giňişleýin</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; padding: 40px 30px">
                    <tbody>
                        <tr>
                            <td>
                                <ul class="how-work" style="margin: 0; padding: 0">
                                    <li style="margin: 0 20px; color: #232323; position: relative; margin-left: 0; display: inline-block; text-decoration: unset"><a href="https://tmcell.tm/about" target="_blank" style="text-decoration: none">Biz barada</a></li>
                                    <li style="margin: 0 20px; color: #232323; position: relative; display: inline-block; text-decoration: unset"><a href="https://tmcell.tm/nyrhnamalar" target="_blank" style="text-decoration: none">Nyrhnamalar</a></li>
                                    <li style="margin: 0 20px; color: #232323; position: relative; display: inline-block; text-decoration: unset"><a href="https://tmcell.tm/hyzmatlar" target="_blank" style="text-decoration: none">Hyzmatlar</a></li>
                                    <li style="margin: 0 20px; color: #232323; position: relative; margin-right: 0; display: inline-block; text-decoration: unset"><a href="https://tmcell.tm/habarlasmak" target="_blank" style="text-decoration: none">Habarlaşmak</a></li>
                                </ul>
                                <p style="margin: 10px auto 0; font-size: 14px; width: 80%; color: #7e7e7e">
                                    Siz <a style="color: #0063b9; text-decoration: underline; font-weight: 700" href="https://tmcell.tm" target="_blank">tmcell.tm</a> web sahypasynda abuna ýazyldyňyz. <br />
                                    Abunany ýatyrmak üçin <a style="color: #0063b9; text-decoration: underline; font-weight: 700" href="javascript:void(0)">şu salga basyň.</a>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>`,
            });
        });
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