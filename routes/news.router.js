const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { News } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await News.findAndCountAll({
        limit,
        offset
    })
        .then((news) => {
            res.json({
                news: news.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: news.count,
                    pages: Math.ceil(news.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, imageUpload.upload.single("news_img"), async (req, res) => {
    await News.create({
        title: req.body.title,
        description: req.body.description,
        news_img: req.file.filename
    }).then(() => {
        res.json({
            success: true,
            message: "Tazelik ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:newsId", isAdmin, async (req, res) => {
    await News.findOne({
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
        img = req.file.filename;

        fs.unlink("/public/img/news/" + req.body.news_img, err => {
            console.log(err);
        })
    }
    await News.update({
        title: req.body.title,
        description: req.body.description,
        img:img
    },
        { where: { id: req.params.newsId } })
        .then(() => {
            res.json({
                success: true,
                message: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:newsId", isAdmin, async (req, res) => {
    await News.findOne({ where: { id: req.params.newsId } })
        .then((news) => {
            if (news) {
                fs.unlink("./public/img/news/" + news.news_img, err => {
                    console.log(err);
                })
                news.destroy()
                return res.json({
                    success: true,
                    message: "Ustunlikli pozuldy"
                })
            } else {
                res.json({
                    success: false,
                    message: "Tapylmady"
                })
            }
        })
});
//superADMIN end





module.exports = router;