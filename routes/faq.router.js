const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Faq } = require("../models/model");


router.get("/", isAdmin, async (req, res) => {
    await Faq.findAll().then((faq) => { res.json({ faq: faq }) })
})

router.post("/create", isAdmin, async (req, res) => {
    await Faq.create({
        question_tm: req.body.question_tm,
        question_en: req.body.question_en,
        question_ru: req.body.question_ru,
        answer_tm: req.body.answer_tm,
        answer_en: req.body.answer_en,
        answer_ru: req.body.answer_ru,
        checked: "1"
    }).then(() => {
        res.json({ success: "Sorag-jogap üstünlikli goşuldy" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:faqId", isAdmin, async (req, res) => {
    await Faq.findOne({ where: { id: req.params.faqId } }).then((faq) => {
        res.json({ faq: faq })
    })
});

router.post("/edit/:faqId", isAdmin, async (req, res) => {
    await Faq.update({
        question_tm: req.body.question_tm,
        question_en: req.body.question_en,
        question_ru: req.body.question_ru,
        answer_tm: req.body.answer_tm,
        answer_en: req.body.answer_en,
        answer_ru: req.body.answer_ru,
        checked: req.body.checked
    }, { where: { id: req.params.faqId } })
        .then(() => { res.json({ success: "Üstünlikli üýtgedildi" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:faqId", isAdmin, async (req, res) => {
    await Faq.findOne({ where: { id: req.params.faqId } }).then((faq) => {
        if (faq) {
            faq.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});


module.exports = router;