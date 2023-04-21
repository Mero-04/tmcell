const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { USSD } = require("../models/model");


router.get("/", isAdmin, async (req, res) => {
    await USSD.findAll().then((ussd) => { res.json({ ussd: ussd }) })
})

router.post("/create", isAdmin, async (req, res) => {
    await USSD.create({
        title_tm: req.body.title_tm,
        title_en: req.body.title_en,
        title_ru: req.body.title_ru,
        code_tm: req.body.code_tm,
        code_en: req.body.code_en,
        code_ru: req.body.code_ru,
        checked: "1"
    }).then(() => {
        res.json({ success: "USSD kod ustinlikli gosuldy" })
    }).catch((error) => { res.json({ error: error }) })
});

router.get("/edit/:ussdId", isAdmin, async (req, res) => {
    await USSD.findOne({ where: { id: req.params.ussdId } }).then((ussd) => {
        res.json({ ussd: ussd })
    })
});

router.post("/edit/:ussdId", isAdmin, async (req, res) => {
    await USSD.update({
        title_tm: req.body.title_tm,
        title_en: req.body.title_en,
        title_ru: req.body.title_ru,
        code_tm: req.body.code_tm,
        code_en: req.body.code_en,
        code_ru: req.body.code_ru,
        checked: req.body.checked
    }, { where: { id: req.params.ussdId } })
        .then(() => { res.json({ success: "Ustunlikli uytgedildi" }) })
        .catch((error) => { res.json({ error: error }) })
});

router.delete("/delete/:ussdId", isAdmin, async (req, res) => {
    await USSD.findOne({ where: { id: req.params.ussdId } }).then((ussd) => {
        if (ussd) {
            ussd.destroy()
            return res.json({ success: "Ustunlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});


module.exports = router;