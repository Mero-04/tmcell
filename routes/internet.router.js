const express = require('express');
const { isAdmin, isInternet } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Internet } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Internet.findAndCountAll({
        limit,
        offset
    })
        .then((internets) => {
            res.json({
                internets: internets.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: internets.count,
                    pages: Math.ceil(internets.count / limit)
                }
            })
        })
})

router.post("/create", isAdmin, imageUpload.upload.single("internet_icon"), async (req, res) => {
    await Internet.create({
        title: req.body.title,
        volume: req.body.volume,
        price: req.body.price,
        short_desc: req.body.short_desc,
        description: req.body.description,
        connect_USSD: req.body.connect_USSD,
        internet_icon: req.file.filename,
        checked: "1"
    }).then(() => {
        res.json({
            success: "Internet nyrhnamasy ustinlikli gosuldy"
        }).catch((err) => {
            let msg = "";
            for (let e of err.errors) {
                msg += e.message + ""
            }
            res.json({ error: msg })
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

router.post("/edit/:internetId", isAdmin, imageUpload.upload.single("internet_icon"), async (req, res) => {
    let img = req.body.internet_icon;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/internet/" + img, err => {
            console.log(err);
        })
    }
    await Internet.update({
        title: req.body.title,
        volume: req.body.volume,
        price: req.body.price,
        short_desc: req.body.short_desc,
        description: req.body.description,
        checked: req.body.checked,
        internet_icon: img,
        connect_USSD: req.body.connect_USSD
    },
        { where: { id: req.params.internetId } })
        .then(() => {
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

router.delete("/delete/:internetId", isAdmin, async (req, res) => {
    await Internet.findOne({ where: { id: req.params.internetId } })
        .then((internet) => {
            if (internet) {
                fs.unlink("./public/img/internet/" + internet.internet_icon, err => { })
                internet.destroy()
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
// router.get("/worker", isInternet, async (req, res) => {
//     const page = req.query.page ? parseInt(req.query.page) : 1;
//     const size = 10;
//     const offset = (page - 1) * size;
//     const limit = page * size;
//     var before = offset > 0 ? page - 1 : 1;
//     var next = page + 1;
//     await Internet.findAndCountAll({
//         limit,
//         offset,
//         where: req.user.role == "Internet" ? { workerId: req.user.id } : null
//     })
//         .then((internets) => {
//             res.json({
//                 internets: internets.rows,
//                 pagination: {
//                     before: before,
//                     next: next,
//                     page: page,
//                     total: internets.count,
//                     pages: Math.ceil(internets.count / size)
//                 }
//             })
//         })
// })

// router.post("/worker/create", isInternet, imageUpload.upload.single("internet_icon"), async (req, res) => {
//     await Internet.create({
//         title: req.body.title,
//         volume: req.body.volume,
//         price: req.body.price,
//         description: req.body.description,
//         connect_USSD: req.body.connect_USSD,
//         internet_icon: req.file.filename,
//         workerId: req.user.id
//     }).then(() => {
//         res.json({
//             success: "Internet nyrhnamasy ustinlikli gosuldy"
//         })
//     })
// });

// router.get("/worker/edit/:internetId", isInternet, async (req, res) => {
//     await Internet.findOne({
//         where: {
//             id: req.params.internetId,
//             workerId: req.user.id
//         }
//     }).then((internet) => {
//         res.json({
//             internet: internet
//         })
//     })
// });

// router.post("/worker/edit/:internetId", isInternet, imageUpload.upload.single("internet_icon"), async (req, res) => {
//     let img = req.body.internet_icon;
//     if (req.file) {
//         img = req.file.filename;
//         fs.unlink("/public/img/internet/" + img, err => {
//             console.log(err);
//         })
//     }
//     await Internet.update({
//         title: req.body.title,
//         volume: req.body.volume,
//         price: req.body.price,
//         description: req.body.description,
//         connect_USSD: req.body.connect_USSD,
//         internet_icon: img,
//         workerId: req.user.id
//     },
//         {
//             where: {
//                 id: req.params.internetId,
//                 workerId: req.user.id
//             }
//         })
//         .then(() => {
//             res.json({
//                 success: "Ustunlikli uytgedildi"
//             })
//         })
// });

// router.delete("/worker/delete/:internetId", isInternet, async (req, res) => {
//     await Internet.findOne({
//         where: {
//             id: req.params.internetId,
//             workerId: req.user.id
//         }
//     })
//         .then((internet) => {
//             if (internet) {
//                 fs.unlink("./public/img/internet/" + internet.internet_icon, err => { })
//                 internet.destroy()
//                 return res.json({
//                     success: "Ustunlikli pozuldy"
//                 })
//             } else {
//                 res.json({
//                     error: "Tapylmady"
//                 })
//             }
//         })
// });
//workerADMIN end



module.exports = router;