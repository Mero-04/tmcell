const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Region } = require("../models/model");

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    await Region.findAll()
        .then((region) => {
            res.json({ region: region })
        })
})

router.post("/create", isAdmin, async (req, res) => {
    await Region.create({
        name: req.body.name
    }).then(() => {
        res.json({
            success: true,
            message: "Welayat ustinlikli gosuldy"
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
        name: req.body.name
    },
        { where: { id: req.params.regionId } })
        .then(() => {
            res.json({
                success: true,
                message: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:regionId", isAdmin, async (req, res) => {
    await Region.findOne({ where: { id: req.params.regionId } })
        .then((region) => {
            if (region) {
                region.destroy()
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