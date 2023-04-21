const express = require('express');
const { isAdmin, isProgram } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Program } = require("../models/model");
const imageUpload = require("../helpers/image-upload")
const multer = require("multer");
const upload = multer({ dest: "./public/img" });
const fs = require('fs')
const sharp = require("sharp");
const qrcode = require("qrcode");
const path = require("path");


router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Program.findAndCountAll({ limit, offset }).then((programs) => {
        res.json({
            programs: programs.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: programs.count,
                pages: Math.ceil(programs.count / size)
            }
        })
    })
})

router.post("/create", isAdmin, imageUpload.upload.single("program_img"), async (req, res) => {
    let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'program', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
    await sharp(req.file.path).jpeg({
        quality: 30,
        chromaSubsampling: '4:4:4'
    }).toFile(compresedImage)

    await qrcode.toDataURL(req.body.play_store, (err, play_url) => {
        qrcode.toDataURL(req.body.app_store, (err, app_url) => {
            Program.create({
                title_tm: req.body.title_tm,
                description_tm: req.body.description_tm,
                title_en: req.body.title_en,
                description_en: req.body.description_en,
                title_ru: req.body.title_ru,
                description_ru: req.body.description_ru,
                play_store: req.body.play_store,
                app_store: req.body.app_store,
                program_img: req.file.filename,
                play_store_qr: play_url,
                app_store_qr: app_url,
                checked: "1"
            }).then(() => {
                res.json({ success: "Mobil gosundy ustinlikli gosuldy" })
            }).catch((error) => { res.json({ error: error }) })
        })
    })
});

router.get("/edit/:programId", isAdmin, async (req, res) => {
    await Program.findOne({ where: { id: req.params.programId } }).then((program) => { res.json({ program: program }) })
});

router.post("/edit/:programId", isAdmin, imageUpload.upload.single("program_img"), async (req, res) => {
    const current = Program.findAll({ where: { id: req.params.programId } });
    let img = req.body.program_img;
    if (req.file) {
        img = req.file.filename;
        fs.unlink("/public/img/program/" + current.img, err => { console.log(err); })
        fs.unlink("/public/compress/program/" + current.img, err => { console.log(err); })

        let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'program', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
        await sharp(req.file.path).jpeg({
            quality: 30,
            chromaSubsampling: '4:4:4'
        }).toFile(compresedImage)
    }

    await qrcode.toDataURL(req.body.play_store, (err, play_url) => {
        qrcode.toDataURL(req.body.app_store, (err, app_url) => {
            Program.update({
                title_tm: req.body.title_tm,
                description_tm: req.body.description_tm,
                title_en: req.body.title_en,
                description_en: req.body.description_en,
                title_ru: req.body.title_ru,
                description_ru: req.body.description_ru,
                play_store: req.body.play_store,
                app_store: req.body.app_store,
                checked: req.body.checked,
                play_store_qr: play_url,
                app_store_qr: app_url,
                program_img: img
            }, { where: { id: req.params.programId } }).then(() => {
                res.json({ success: "Ustunlikli uytgedildi" })
            }).catch((error) => { res.json({ error: error }) })
        })
    })
});

router.delete("/delete/:programId", isAdmin, async (req, res) => {
    await Program.findOne({ where: { id: req.params.programId } }).then((program) => {
        if (program) {
            fs.unlink("./public/img/program/" + program.program_img, err => { })
            fs.unlink("./public/compress/program/" + program.program_img, err => { })
            program.destroy()
            return res.json({ success: "Ustunlikli pozuldy" })
        } else {
            res.json({ error: "Tapylmady" })
        }
    })
});


//workerADMIN start
// router.get("/worker", isProgram, async (req, res) => {
//     const page = req.query.page ? parseInt(req.query.page) : 1;
//     const size = 10;
//     const offset = (page - 1) * size;
//     const limit = page * size;
//     var before = offset > 0 ? page - 1 : 1;
//     var next = page + 1;
//     await Program.findAndCountAll({
//         limit,
//         offset,
//         where: req.user.role == "Program" ? { workerId: req.user.id } : null
//     })
//         .then((programs) => {
//             res.json({
//                 programs: programs.rows,
//                 pagination: {
//                     before: before,
//                     next: next,
//                     page: page,
//                     total: programs.count,
//                     pages: Math.ceil(programs.count / size)
//                 }
//             })
//         })
// });

// router.post("/worker/create", isProgram, imageUpload.upload.single("program_img"), async (req, res) => {
//     let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'program', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
//     await sharp(req.file.path).jpeg({
//         quality: 30,
//         chromaSubsampling: '4:4:4'
//     }).toFile(compresedImage)

//     await Program.create({
//         title: req.body.title,
//         description: req.body.description,
//         play_store: req.body.play_store,
//         app_store: req.body.app_store,
//         program_img: req.file.filename,
//         workerId: req.user.id
//     }).then(() => {
//         res.json({
//             success: "Mobil gosundy ustinlikli gosuldy"
//         })
//     })
// });

// router.get("/worker/edit/:programId", isProgram, async (req, res) => {
//     await Program.findOne({
//         where: {
//             id: req.params.programId,
//             workerId: req.user.id
//         }
//     }).then((program) => {
//         res.json({
//             program: program
//         })
//     })
// });

// router.post("/worker/edit/:programId", isProgram, imageUpload.upload.single("program_img"), async (req, res) => {
//     let img = req.body.program_img;
//     if (req.file) {
//           img = req.file.filename;
//         fs.unlink("/public/img/program/" + img, err => {
//             console.log(err);
//         })
//         fs.unlink("/public/compress/program/" + img, err => {
//             console.log(err);
//         })

//         let compresedImage = path.join(__dirname, '../', 'public', 'compress', 'program', path.parse(req.file.fieldname).name + "_" + path.parse(req.body.title_tm).name + path.extname(req.file.originalname));
//         await sharp(req.file.path).jpeg({
//             quality: 30,
//             chromaSubsampling: '4:4:4'
//         }).toFile(compresedImage)
//     }
//     await Program.update({
//         title: req.body.title,
//         description: req.body.description,
//         play_store: req.body.play_store,
//         app_store: req.body.app_store,
//         program_img: img,
//         workerId: req.user.id
//     },
//         {
//             where: {
//                 id: req.params.programId,
//                 workerId: req.user.id
//             }
//         })
//         .then(() => {
//             res.json({
//                 success: "Ustunlikli uytgedildi"
//             })
//         })
// });

// router.delete("/worker/delete/:programId", isProgram, async (req, res) => {
//     await Program.findOne({
//         where: {
//             id: req.params.programId,
//             workerId: req.user.id
//         }
//     })
//         .then((program) => {
//             if (program) {
//                 fs.unlink("./public/img/program/" + program.program_img, err => { })
//                 fs.unlink("./public/compress/program/" + program.program_img, err => { })
//                 program.destroy()
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