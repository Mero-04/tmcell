const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Banner } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    await Banner.findAll()
        .then((banner) => {
            res.json({ banner: banner })
        })
})

router.post("/create", isAdmin, imageUpload.upload.single("banner_img"), async (req, res) => {
    await Banner.create({
        link: req.body.link,
        banner_img: res.file.filename
    }).then(() => {
        res.json({
            success: "Banner ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:bannerId", isAdmin, async (req, res) => {
    await Banner.findOne({
        where: { id: req.params.bannerId }
    }).then((banner) => {
        res.json({
            banner: banner
        })
    })
});

router.post("/edit/:bannerId", isAdmin, imageUpload.upload.single("banner_img"), async (req, res) => {
    let img = req.body.banner_img;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/banner/" + img, err => {
            console.log(err);
        })
    }
    await Banner.update({
        link: req.body.link,
        img: img
    },
        { where: { id: req.params.bannerId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:bannerId", isAdmin, async (req, res) => {
    await Banner.findOne({ where: { id: req.params.bannerId } })
        .then((banner) => {
            if (banner) {
                fs.unlink("./public/img/banner/" + banner.banner_img, err => { })
                banner.destroy()
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





module.exports = router;