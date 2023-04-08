const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Region, Welayat } = require("../models/model");

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    await Region.findAll({ include: { model: Welayat, attributes: ['id', 'name'] } })
        .then((region) => {
            res.json({ region: region })
        })
})

router.get("/create", isAdmin, async (req, res) => {
    await Welayat.findAll().then((welayats) => {
        res.json({ welayats: welayats })
    })
});

router.post("/create", isAdmin, async (req, res) => {
    await Region.create({
        name: req.body.name,
        welayatId: req.body.welayatId
    }).then(() => {
        res.json({
            success: "Etrap ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:regionId", isAdmin, async (req, res) => {
    await Region.findOne({
        where: { id: req.params.regionId }
    }).then((region) => {
        res.json({
            region: region
        })
    })
});

router.post("/edit/:regionId", isAdmin, async (req, res) => {
    await Region.update({
        name: req.body.name,
        welayatId: req.body.welayatId
    },
        { where: { id: req.params.regionId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:regionId", isAdmin, async (req, res) => {
    await Region.findOne({ where: { id: req.params.regionId } })
        .then((region) => {
            if (region) {
                region.destroy()
                return res.json({
                    success:  "Ustunlikli pozuldy"
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