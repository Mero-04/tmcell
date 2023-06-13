const express = require('express');
const { isAdmin, isNews } = require('../middlewares/authMiddleware');
const router = express.Router();
const { News, Category, Worker } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")
const moment = require("moment")
const emailService = require("../helpers/send-mail");

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await News.findAndCountAll({
        limit,
        offset,
        order: [
            ["id", "DESC"]
        ],
        include: [
            { model: Category },
            { model: Worker, attributes: ['id', 'name'] }
        ]
    }).then((news) => {
        res.json({
            news: news.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: news.count,
                pages: Math.ceil(news.count / limit)
            }
        })
    })
})

router.get("/create", isAdmin, async (req, res) => {
    await Category.findAll().then((category) => {
        res.json({ category: category })
    })
});

router.post("/create", isAdmin, imageUpload.upload.single("news_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'news', path.parse(req.file.fieldname).name + "_" + path.parse(req.file.originalname).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await News.create({
        title_tm: req.body.title_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        description_ru: req.body.description_ru,
        news_img: req.file.filename,
        categoryId: req.body.categoryId,
        checked: "1",
        created_at: moment().format('YYYY-MM-DD')
    }).then(() => {
        res.json({
            success: "Täzelik üstünlikli goşuldy"
        })
    }).catch((error) => {
        res.status(500).json({ error: error })
    })
});

router.get("/edit/:newsId", isAdmin, async (req, res) => {
    await News.findOne({
        include: { model: Category, attributes: ['id', 'name_tm', 'name_en', "name_ru"] },
        where: { id: req.params.newsId }
    }).then((news) => {
        res.json({
            news: news
        })
    })
});

router.post("/edit/:newsId", isAdmin, imageUpload.upload.single("news_img"), async (req, res) => {
    let img = req.body.news_img;
    if (req.file) {
        fs.unlink("/public/img/news/" + img, err => {
            console.log(err);
        })
        fs.unlink("/public/compress/news/" + img, err => {
            console.log(err);
        })
        img = req.file.filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'news', path.parse(req.file.fieldname).name + "_" + path.parse(req.file.originalname).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }
    await News.update({
        title_tm: req.body.title_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        description_ru: req.body.description_ru,
        news_img: img,
        checked: req.body.checked,
        categoryId: req.body.categoryId
    }, { where: { id: req.params.newsId } }).then(() => {
        res.json({
            success: "Üstünlikli üýtgedildi"
        })
    }).catch((error) => {
        res.status(500).json({ error: error })
    })
});

router.post("/group/:newsId", isAdmin, async (req, res) => {
    await News.update({
        checked: req.body.checked
    }, { where: { id: req.params.newsId } }).then(() => {
        res.json({
            success: "Täzeligiň statusy üýtgedildi"
        })
    }).catch((error) => {
        res.status(500).json({ error: error })
    })
});

router.delete("/delete/:newsId", isAdmin, async (req, res) => {
    await News.findOne({ where: { id: req.params.newsId } }).then((news) => {
        if (news) {
            fs.unlink("./public/img/news/" + news.news_img, err => { })
            fs.unlink("./public/compress/news/" + news.news_img, err => { })
            news.destroy()
            return res.json({
                success: "Ustunlikli pozuldy"
            })
        } else {
            res.json({
                error: "Tapylmady"
            })
        }
    })
});



router.get("/worker/", isNews, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await News.findAndCountAll({
        limit,
        offset,
        order: [
            ["id", "DESC"]
        ],
        include: { model: Category, attributes: ['id', 'name_tm'] },
        where: req.user.role == "Tazelik" ? { workerId: req.user.id } : null
    }).then((news) => {
        res.json({
            news: news.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: news.count,
                pages: Math.ceil(news.count / limit)
            }
        })
    })
})

router.get("/worker/create", isNews, async (req, res) => {
    await Category.findAll().then((category) => { res.json({ category: category }) })
});

router.post("/worker/create", isNews, imageUpload.upload.single("news_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'news', path.parse(req.file.fieldname).name + "_" + path.parse(req.file.originalname).name + path.extname(req.file.originalname));

    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await News.create({
        title_tm: req.body.title_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        description_ru: req.body.description_ru,
        news_img: req.file.filename,
        categoryId: req.body.categoryId,
        workerId: req.user.id,
        created_at: moment().format('YYYY-MM-DD')
    }).then(async () => {
        var maillist = ['mr.akynyaz29@gmail.com', 'yagmyrguly@inbox.ru', 'mandsh@mail.ru', 'altynasyr.ygpj@bk.ru', 'news_tmcell@tmcell.tm']
        await emailService.sendMail({
            from: process.env.EMAIL_USER,
            to: maillist,
            subject: 'Tazelik adminlary tarapyndan täzelik goşuldy!',
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
                                            <p style="font-size:16px;line-height:24px;margin:16px 0;color:#48494d;text-align:left">
                                                Salam!</p>
                                            <p style="font-size:16px;line-height:24px;margin:16px 0;color:#48494d;text-align:left">
                                                Täzelik adminleri tarapyndan täzelik goşuldy. Täzeligi tassyklamak üçin gök düwmä basyň:</p>
            
                                                <a href="https://tmcell.tm/root_admin_login" target="_blank"
                                                    style="background-color:#0063b9;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;p-x:10px;p-y:10px;line-height:100%;max-width:100%;padding:10px 10px"><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;mso-text-raise:15" hidden>&nbsp;</i><![endif]--></span><span
                                                        style="background-color:#0063b9;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;p-x:10px;p-y:10px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:7.5px">Tassyklamak</span><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
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
    }).then(() => { res.json({ success: "Täzelik üstinlikli goşuldy" }) })
});

router.get("/worker/edit/:newsId", isNews, async (req, res) => {
    await News.findOne({
        include: { model: Category, attributes: ['id', 'name_tm', 'name_en', "name_ru"] },
        where: { id: req.params.newsId, workerId: req.user.id }
    }).then((news) => { res.json({ news: news }) })
});

router.post("/worker/edit/:newsId", isNews, imageUpload.upload.single("news_img"), async (req, res) => {
    let img = req.body.news_img;
    if (req.file) {
        fs.unlink("/public/img/news/" + img, err => { console.log(err); })
        fs.unlink("/public/compress/news/" + img, err => { console.log(err); })
        img = req.file.filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'news', path.parse(req.file.fieldname).name + "_" + path.parse(req.file.originalname).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }
    await News.update({
        title_tm: req.body.title_tm,
        description_tm: req.body.description_tm,
        title_en: req.body.title_en,
        description_en: req.body.description_en,
        title_ru: req.body.title_ru,
        description_ru: req.body.description_ru,
        news_img: img,
        categoryId: req.body.categoryId,
        workerId: req.user.id
    }, {
        where: {
            id: req.params.newsId,
            workerId: req.user.id
        }
    }).then(() => { res.json({ success: "Üstünlikli üýtgedildi" }) })
});

router.delete("/worker/delete/:newsId", isNews, async (req, res) => {
    await News.findOne({ where: { id: req.params.newsId } }).then((news) => {
        if (news) {
            fs.unlink("./public/img/news/" + news.news_img, err => { })
            fs.unlink("./public/compress/news/" + news.news_img, err => { })
            news.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});



module.exports = router;