const express = require('express');
const { isAdmin, isTariff } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Tarif } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")

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
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'tarif', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Tarif.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        tarif_img: req.file.filename,
        checked: "1"
    }).then(() => {
        res.json({
            success: "Nyrhnama ustinlikli gosuldy"
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
        fs.unlink("/public/img/tarif/" + img, err => {
            console.log(err);
        })
        fs.unlink("/public/compress/tarif/" + img, err => {
            console.log(err);
        })

        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'tarif', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }

    await Tarif.update({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        checked: req.body.checked,
        tarif_img: img
    },
        { where: { id: req.params.tarifId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:tarifId", isAdmin, async (req, res) => {
    await Tarif.findOne({ where: { id: req.params.tarifId } })
        .then((tarif) => {
            if (tarif) {
                fs.unlink("./public/img/tarif/" + tarif.tarif_img, err => { })
                fs.unlink("./public/compress/tarif/" + tarif.tarif_img, err => { })
                tarif.destroy()
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


//workerADMIN start
router.get("/worker", isTariff, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Tarif.findAndCountAll({
        limit,
        offset,
        where: req.user.role == "Nyrhnama" ? { workerId: req.user.id } : null
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
});

router.post("/worker/create", isTariff, imageUpload.upload.single("tarif_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'tarif', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Tarif.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        tarif_img: req.file.filename,
        workerId: req.user.id
    }).then(() => {
        res.json({
            success: "Nyrhnama ustinlikli gosuldy"
        })
    })
});

router.get("/worker/edit/:tarifId", isTariff, async (req, res) => {
    await Tarif.findOne({
        where: {
            id: req.params.tarifId,
            workerId: req.user.id
        }
    }).then((tarif) => {
        res.json({
            tarif: tarif
        })
    })
});

router.post("/worker/edit/:tarifId", isTariff, imageUpload.upload.single("tarif_img"), async (req, res) => {
    let img = req.body.tarif_img;
    if (req.file) {
          img = req.file.filename;
        fs.unlink("/public/img/tarif/" + img, err => {
            console.log(err);
        })
        fs.unlink("/public/compress/tarif/" + img, err => {
            console.log(err);
        })

        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'tarif', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }
    await Tarif.update({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        tarif_img: img,
        workerId: req.user.id
    },
        {
            where: {
                id: req.params.tarifId,
                workerId: req.user.id
            }
        })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/worker/delete/:tarifId", isTariff, async (req, res) => {
    await Tarif.findOne({
        where: {
            id: req.params.tarifId,
            workerId: req.user.id
        }
    })
        .then((tarif) => {
            if (tarif) {
                fs.unlink("./public/img/tarif/" + tarif.tarif_img, err => { })
                fs.unlink("./public/compress/tarif/" + tarif.tarif_img, err => { })
                tarif.destroy()
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