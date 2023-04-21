const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Welayat, Region } = require("../models/model");

router.get("/", isAdmin, async (req, res) => {
    await Welayat.findAll({ model: Region, attributes: ['id', 'name','name_en', "name_ru"] }).then((welayat) => {
        res.json({ welayat: welayat })
    })
})

router.post("/create", isAdmin, async (req, res) => {
    await Welayat.create({
        name_tm: req.body.name_tm,
        name_en: req.body.name_en,
        name_ru: req.body.name_ru
    })
        .then(() => { res.json({ success: "Welayat ustinlikli gosuldy" }) })
        .catch((error) => { res.json({ error: error }) })
});

router.get("/edit/:welayatId", isAdmin, async (req, res) => {
    await Welayat.findOne({ where: { id: req.params.welayatId } })
        .then((welayat) => { res.json({ welayat: welayat }) })
});

router.post("/edit/:welayatId", isAdmin, async (req, res) => {
    await Welayat.update({
        name_tm: req.body.name_tm,
        name_en: req.body.name_en,
        name_ru: req.body.name_ru
    }, { where: { id: req.params.welayatId } }).then(() => {
        res.json({ success: "Ustunlikli uytgedildi" })
    }).catch((error) => { res.json({ error: error }) })
});

router.delete("/delete/:welayatId", isAdmin, async (req, res) => {
    await Welayat.findOne({ where: { id: req.params.welayatId } }).then((welayat) => {
        if (welayat) {
            welayat.destroy()
            return res.json({ success: "Ustunlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});

module.exports = router;