const express = require('express');
const { isAdmin, isService } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Service } = require("../models/model");
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
    await Service.findAndCountAll({
        limit,
        offset
    })
        .then((services) => {
            res.json({
                services: services.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: services.count,
                    pages: Math.ceil(services.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, imageUpload.upload.single("service_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'service', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Service.create({
        title: req.body.title,
        description: req.body.description,
        service_img: req.file.filename,
        icon: req.body.icon,
    }).then(() => {
        res.json({
            success: "Hyzmat ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:serviceId", isAdmin, async (req, res) => {
    await Service.findOne({
        where: { id: req.params.serviceId }
    }).then((service) => {
        res.json({
            service: service
        })
    })
});

router.post("/edit/:serviceId", isAdmin, imageUpload.upload.single("service_img"), async (req, res) => {
    let img = req.body.service_img;
    if (req.file) {
        fs.unlink("/public/img/service/" + img, err => {
            console.log(err);
        })
        fs.unlink("/public/compress/service/" + img, err => {
            console.log(err);
        })
        img = req.file.filename;
        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'service', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }

    await Service.update({
        title: req.body.title,
        description: req.body.description,
        icon: req.body.icon,
        checked: req.body.checked,
        img: img
    },
        { where: { id: req.params.serviceId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:serviceId", isAdmin, async (req, res) => {
    await Service.findOne({ where: { id: req.params.serviceId } })
        .then((service) => {
            if (service) {
                fs.unlink("./public/img/service/" + service.service_img, err => { })
                fs.unlink("./public/compress/service/" + service.service_img, err => { })
                service.destroy()
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



//superADMIN start
router.get("/worker", isService, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Service.findAndCountAll({
        limit,
        offset,
        where: req.user.role == "Hyzmat" ? { workerId: req.user.id } : null
    })
        .then((services) => {
            res.json({
                services: services.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: services.count,
                    pages: Math.ceil(services.count / size)
                }
            })
        })
})

router.post("/worker/create", isService, imageUpload.upload.single("service_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'service', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await Service.create({
        title: req.body.title,
        description: req.body.description,
        service_img: req.file.filename,
        icon: req.body.icon,
        workerId: req.user.id
    }).then(() => {
        res.json({
            success: "Hyzmat ustinlikli gosuldy"
        })
    })
});

router.get("/worker/edit/:serviceId", isService, async (req, res) => {
    await Service.findOne({
        where: {
            id: req.params.serviceId,
            workerId: req.user.id
        }
    }).then((service) => {
        res.json({
            service: service
        })
    })
});

router.post("/worker/edit/:serviceId", isService, imageUpload.upload.single("service_img"), async (req, res) => {
    let img = req.body.service_img;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/service/" + img, err => {
            console.log(err);
        })
        fs.unlink("/public/compress/service/" + img, err => {
            console.log(err);
        })

        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'service', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }

    await Service.update({
        title: req.body.title,
        description: req.body.description,
        icon: req.body.icon,
        img: img,
        workerId: req.user.id
    },
        {
            where: {
                id: req.params.serviceId,
                workerId: req.user.id
            }
        })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/worker/delete/:serviceId", isService, async (req, res) => {
    await Service.findOne({
        where: {
            id: req.params.serviceId,
            workerId: req.user.id
        }
    })
        .then((service) => {
            if (service) {
                fs.unlink("./public/img/service/" + service.service_img, err => { })
                fs.unlink("./public/compress/service/" + service.service_img, err => { })
                service.destroy()
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