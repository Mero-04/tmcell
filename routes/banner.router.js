const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Banner } = require("../models/model");
const bannerUpload = require("../helpers/banner-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")



//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    await Banner.findAll()
        .then((banner) => {
            res.json({ banner: banner })
        })
})

router.post("/create", isAdmin, bannerUpload.upload.single("banner_img"), async (req, res) => {
    await Banner.create({
        link: req.body.link,
        banner_img: req.file.filename
    }).then(() => {
        res.json({
            success: "Banner ustinlikli gosuldy"
        })
    }).catch((err)=>{
        let msg = "";
        for (let e of err.errors) {
            msg += e.message + ""
        }
        res.json({error: msg})
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

router.post("/edit/:bannerId", isAdmin, bannerUpload.upload.single("banner_img"), async (req, res) => {
    let img = req.body.banner_img;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/banner/" + img, err => {
            console.log(err);
        })
    }
    await Banner.update({
        link: req.body.link,
        banner_img: img
    },
        { where: { id: req.params.bannerId } })
        .then(() => {21321321
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
        .catch((err) => {
            let msg = "";
            for (let e of err.errors) {
                msg += e.message + ""
            }
            res.json({ error: msg })
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