const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Welayat,Region } = require("../models/model");

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    await Welayat.findAll( { model: Region, attributes: ['id', 'name'] })
        .then((welayat) => {
            res.json({ welayat: welayat })
        })
})

router.post("/create", isAdmin, async (req, res) => {
    await Welayat.create({
        name: req.body.name
    }).then(() => {
        res.json({
            success: true,
            message: "Welayat ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:welayatId", isAdmin, async (req, res) => {
    await Welayat.findOne({
        where: { id: req.params.welayatId }
    }).then((welayat) => {
        res.json({
            welayat: welayat
        })
    })
});

router.post("/edit/:welayatId", isAdmin, async (req, res) => {
    await Welayat.update({
        name: req.body.name
    },
        { where: { id: req.params.welayatId } })
        .then(() => {
            res.json({
                success: true,
                message: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:welayatId", isAdmin, async (req, res) => {
    await Welayat.findOne({ where: { id: req.params.welayatId } })
        .then((welayat) => {
            if (welayat) {
                welayat.destroy()
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