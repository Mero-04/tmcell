const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Korporatiw } = require("../models/model");
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
    await Korporatiw.findAndCountAll({
        limit,
        offset
    })
        .then((korporatiws) => {
            res.json({
                korporatiws: korporatiws.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: korporatiws.count,
                    pages: Math.ceil(korporatiws.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, imageUpload.upload.single("korporatiw_img"), async (req, res) => {
    await Korporatiw.create({
        title: req.body.title,
        description: req.body.description,
        korporatiw_img: req.file.filename
    }).then(() => {
        res.json({
            success: true,
            message: "Korporatiw nyrhnama ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:korporatiwId", isAdmin, async (req, res) => {
    await Korporatiw.findOne({
        where: { id: req.params.korporatiwId }
    }).then((korporatiw) => {
        res.json({
            korporatiw: korporatiw
        })
    })
});

router.post("/edit/:korporatiwId", isAdmin, imageUpload.upload.single("korporatiw_img"), async (req, res) => {
    let img = req.body.korporatiw_img;
    if (req.file) {
        img = req.file.filename;

        fs.unlink("/public/img/korporatiw/" + req.body.korporatiw_img, err => {
            console.log(err);
        })
    }
    await Korporatiw.update({
        title: req.body.title,
        description: req.body.description,
        img:img
    },
        { where: { id: req.params.korporatiwId } })
        .then(() => {
            res.json({
                success: true,
                message: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:korporatiwId", isAdmin, async (req, res) => {
    await Korporatiw.findOne({ where: { id: req.params.korporatiwId } })
        .then((korporatiw) => {
            if (korporatiw) {
                fs.unlink("./public/img/korporatiw/" + korporatiw.korporatiw_img, err => {
                    console.log(err);
                })
                korporatiw.destroy()
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