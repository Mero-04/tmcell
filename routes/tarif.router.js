const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Tarif } = require("../models/model");
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
    await Tarif.findAndCountAll({
        limit,
        offset
    })
        .then((tarifs) => {
            res.json({
                tarifs: tarifs.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: tarifs.count,
                    pages: Math.ceil(tarifs.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, imageUpload.upload.single("tarif_img"), async (req, res) => {
    await Tarif.create({
        title: req.body.title,
        description: req.body.description,
        tarif_img: req.file.filename
    }).then(() => {
        res.json({
            success: true,
            message: "Nyrhnama ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:tarifId", isAdmin, async (req, res) => {
    await Tarif.findOne({
        where: { id: req.params.tarifId }
    }).then((tarif) => {
        res.json({
            tarif: tarif
        })
    })
});

router.post("/edit/:tarifId", isAdmin, imageUpload.upload.single("tarif_img"), async (req, res) => {
    let img = req.body.tarif_img;
    if (req.file) {
        img = req.file.filename;

        fs.unlink("/public/img/tarif/" + req.body.tarif_img, err => {
            console.log(err);
        })
    }
    await Tarif.update({
        title: req.body.title,
        description: req.body.description,
        img:img
    },
        { where: { id: req.params.tarifId } })
        .then(() => {
            res.json({
                success: true,
                message: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:tarifId", isAdmin, async (req, res) => {
    await Tarif.findOne({ where: { id: req.params.tarifId } })
        .then((tarif) => {
            if (tarif) {
                fs.unlink("./public/img/tarif/" + tarif.tarif_img, err => {
                    console.log(err);
                })
                tarif.destroy()
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