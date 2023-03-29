const express = require('express');
const { isAdmin, isNews } = require('../middlewares/authMiddleware');
const router = express.Router();
const { News, Category } = require("../models/model");
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
        offset,
        include: { model: Category, attributes: ['id', 'name'] }
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

router.get("/create", isAdmin, async (req, res) => {
    await Category.findAll().then((category) => {
        res.json({ category: category })
    })
});

router.post("/create", isAdmin, imageUpload.upload.single("news_img"), async (req, res) => {
    await News.create({
        title: req.body.title,
        description: req.body.description,
        news_img: req.file.filename,
        categoryId: req.body.categoryId
    }).then(() => {
        res.json({
            success: "Tazelik ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:newsId", isAdmin, async (req, res) => {
    await News.findOne({
        where: { id: req.params.newsId },
        include: { model: Category, attributes: ['id', 'name'] }
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
        img: img,
        categoryId: req.body.categoryId
    },
        { where: { id: req.params.newsId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
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
                    success: "Ustunlikli pozuldy"
                })
            } else {
                res.json({
                    error: "Tapylmady"
                })
            }
        })
});
//superADMIN end


//workerAdmin start
router.get("/worker/", isNews, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await News.findAndCountAll({
        limit,
        offset,
        where: req.user.role == "Tazelik" ? { workerId: req.user.id } : null,
        include: { model: Category, attributes: ['id', 'name'] }
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

router.get("/worker/create", isAdmin, async (req, res) => {
    await Category.findAll().then((category) => {
        res.json({ category: category })
    })
});

router.post("/worker/create", isNews, imageUpload.upload.single("news_img"), async (req, res) => {
    await News.create({
        title: req.body.title,
        description: req.body.description,
        news_img: req.file.filename,
        categoryId: req.body.categoryId,
        workerId: req.user.id
    }).then(() => {
        res.json({
            success: "Tazelik ustinlikli gosuldy"
        })
    })
});

router.get("/worker/edit/:newsId", isNews, async (req, res) => {
    await News.findOne({
        where: {
            id: req.params.newsId,
            workerId: req.user.id
        }
    }).then((news) => {
        res.json({
            news: news
        })
    })
});

router.post("/worker/edit/:newsId", isNews, imageUpload.upload.single("news_img"), async (req, res) => {
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
        img: img,
        categoryId: req.body.categoryId,
        workerId: req.user.id
    },
        {
            where: {
                id: req.params.newsId,
                workerId: req.user.id
            }
        })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/worker/delete/:newsId", isNews, async (req, res) => {
    await News.findOne({ where: { id: req.params.newsId } })
        .then((news) => {
            if (news) {
                fs.unlink("./public/img/news/" + news.news_img, err => {
                    console.log(err);
                })
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
//workerADMIN end




module.exports = router;