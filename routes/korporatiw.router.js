const express = require('express');
const { isAdmin, isTariff } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Korporatiw } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const path = require("path")


//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit =20;
    const offset = (page - 1) * limit;
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
                    pages: Math.ceil(korporatiws.count / limit)
                }
            })
        })
})

router.post("/create", isAdmin,imageUpload.upload.single("korporatiw_icon"), async (req, res) => {
    await Korporatiw.create({
        title: req.body.title,
        short_desc: req.body.short_desc,
        description: req.body.description,
        korporatiw_icon: req.file.filename,
        checked: "1"
    }).then(() => {
        res.json({
            success: "Korporatiw nyrhnama ustinlikli gosuldy"
        })
    }).catch((err)=>{
        let msg = "";
        for (let e of err.errors) {
            msg += e.message + ""
        }
        res.json({error: msg})
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

router.post("/edit/:korporatiwId", isAdmin, imageUpload.upload.single("korporatiw_icon"), async (req, res) => {
    let img = req.body.korporatiw_icon;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/korporatiw/" + img, err => {
            console.log(err);
        })
    }
    await Korporatiw.update({
        title: req.body.title,
        short_desc: req.body.short_desc,
        description: req.body.description,
        checked: req.body.checked,
        korporatiw_icon: img
    },
        { where: { id: req.params.korporatiwId } })
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

router.delete("/delete/:korporatiwId", isAdmin, async (req, res) => {
    await Korporatiw.findOne({ where: { id: req.params.korporatiwId } })
        .then((korporatiw) => {
            if (korporatiw) {
                fs.unlink("./public/img/korporatiw/" + korporatiw.korporatiw_icon, err => { })
                korporatiw.destroy()
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
// router.get("/worker", isTariff, async (req, res) => {
//     const page = req.query.page ? parseInt(req.query.page) : 1;
//     const size = 10;
//     const offset = (page - 1) * size;
//     const limit = page * size;
//     var before = offset > 0 ? page - 1 : 1;
//     var next = page + 1;
//     await Korporatiw.findAndCountAll({
//         limit,
//         offset,
//         where: req.user.role == "Nyrhnama" ? { workerId: req.user.id } : null
//     })
//         .then((korporatiws) => {
//             res.json({
//                 korporatiws: korporatiws.rows,
//                 pagination: {
//                     before: before,
//                     next: next,
//                     page: page,
//                     total: korporatiws.count,
//                     pages: Math.ceil(korporatiws.count / size)
//                 }
//             })
//         })
// })

// router.post("/worker/create", isAdmin, imageUpload.upload.single("korporatiw_icon"),  async (req, res) => {
//     await Korporatiw.create({
//         title: req.body.title,
//         description: req.body.description,
//         korporatiw_icon: req.file.filename,
//         workerId: req.user.id
//     }).then(() => {
//         res.json({
//             success: "Korporatiw nyrhnama ustinlikli gosuldy"
//         })
//     })
// });

// router.get("/worker/edit/:korporatiwId", isTariff, async (req, res) => {
//     await Korporatiw.findOne({
//         where: {
//             id: req.params.korporatiwId,
//             workerId: req.user.id
//         }
//     }).then((korporatiw) => {
//         res.json({
//             korporatiw: korporatiw
//         })
//     })
// });

// router.post("/worker/edit/:korporatiwId", isTariff, imageUpload.upload.single("korporatiw_icon"), async (req, res) => {
//     let img = req.body.korporatiw_icon;
//     if (req.file) {
//         img = req.file.filename;
//         fs.unlink("/public/img/korporatiw/" + img, err => {
//             console.log(err);
//         })
//     }
//     await Korporatiw.update({
//         title: req.body.title,
//         description: req.body.description,
//         korporatiw_icon: img,
//         workerId: req.user.id
//     },
//         { where: { id: req.params.korporatiwId } })
//         .then(() => {
//             res.json({
//                 success: "Ustunlikli uytgedildi"
//             })
//         })
// });

// router.delete("/worker/delete/:korporatiwId", isTariff, async (req, res) => {
//     await Korporatiw.findOne({ where: { id: req.params.korporatiwId } })
//         .then((korporatiw) => {
//             if (korporatiw) {
//                 fs.unlink("./public/img/korporatiw/" + korporatiw.korporatiw_icon, err => { })
//                 korporatiw.destroy()
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