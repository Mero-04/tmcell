const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Internet } = require("../models/model");
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
    await Internet.findAndCountAll({
        limit,
        offset
    })
        .then((internet) => {
            res.json({
                internet: internet.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: internet.count,
                    pages: Math.ceil(internet.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, imageUpload.upload.single("internet_img"), async (req, res) => {
    await Internet.create({
        title: req.body.title,
        volume: req.body.volume,
        price: req.body.price,
        description: req.body.description,
        connectUSSD: req.body.connectUSSD,
        internet_img: req.file.filename
    }).then(() => {
        res.json({
            success: true,
            message: "Internet nyrhnamasy ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:internetId", isAdmin, async (req, res) => {
    await Internet.findOne({
        where: { id: req.params.internetId }
    }).then((internet) => {
        res.json({
            internet: internet
        })
    })
});

router.post("/edit/:internetId", isAdmin, imageUpload.upload.single("internet_img"), async (req, res) => {
    let img = req.body.internet_img;
    if (req.file) {
        img = req.file.filename;

        fs.unlink("/public/img/internet/" + req.body.internet_img, err => {
            console.log(err);
        })
    }
    await Internet.update({
        title: req.body.title,
        volume: req.body.volume,
        price: req.body.price,
        description: req.body.description,
        connectUSSD: req.body.connectUSSD,
        img:img
    },
        { where: { id: req.params.internetId } })
        .then(() => {
            res.json({
                success: true,
                message: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:internetId", isAdmin, async (req, res) => {
    await Internet.findOne({ where: { id: req.params.internetId } })
        .then((internet) => {
            if (internet) {
                fs.unlink("./public/img/internet/" + news.internet_img, err => {
                    console.log(err);
                })
                internet.destroy()
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