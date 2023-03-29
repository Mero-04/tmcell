const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Service } = require("../models/model");
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
    await Service.create({
        title: req.body.title,
        description: req.body.description,
        service_img: req.file.filename
    }).then(() => {
        res.json({
            success: true,
            message: "Hyzmat ustinlikli gosuldy"
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
        img = req.file.filename;

        fs.unlink("/public/img/service/" + req.body.service_img, err => {
            console.log(err);
        })
    }
    await Service.update({
        title: req.body.title,
        description: req.body.description,
        img:img
    },
        { where: { id: req.params.serviceId } })
        .then(() => {
            res.json({
                success: true,
                message: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:serviceId", isAdmin, async (req, res) => {
    await Service.findOne({ where: { id: req.params.serviceId } })
        .then((service) => {
            if (service) {
                fs.unlink("./public/img/service/" + service.service_img, err => {
                    console.log(err);
                })
                service.destroy()
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