const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Region, Welayat } = require("../models/model");

router.get("/", isAdmin, async (req, res) => {
    await Region.findAll({ include: { model: Welayat, attributes: ['id', 'name_tm'] } }).then((region) => { res.json({ region: region }) })
})

router.get("/create", isAdmin, async (req, res) => {
    await Welayat.findAll().then((welayats) => { res.json({ welayats: welayats }) })
});

router.post("/create", isAdmin, async (req, res) => {
    await Region.create({
        name_tm: req.body.name_tm,
        name_en: req.body.name_en,
        name_ru: req.body.name_ru,
        welayatId: req.body.welayatId
    }).then(() => {
       return res.json({ success: "Etrap üstünlikli goşuldy" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:regionId", isAdmin, async (req, res) => {
    await Region.findOne({
        include: { model: Welayat, attributes: ['id', 'name_tm', 'name_en', 'name_ru'] },
        where: { id: req.params.regionId }
    }).then((region) => {
        return res.json({
            region: region
        })
    })
});

router.post("/edit/:regionId", isAdmin, async (req, res) => {
    await Region.update({
        name_tm: req.body.name_tm,
        name_en: req.body.name_en,
        name_ru: req.body.name_ru,
        welayatId: req.body.welayatId
    }, { where: { id: req.params.regionId } }).then(() => {
        res.json({ success: "Üstünlikli üytgedildi" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:regionId", isAdmin, async (req, res) => {
    await Region.findOne({ where: { id: req.params.regionId } }).then((region) => {
        if (region) {
            region.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});





module.exports = router;