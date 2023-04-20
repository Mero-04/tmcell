const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Faq } = require("../models/model");


router.get("/", isAdmin, async (req, res) => {
    await Faq.findAll().then((faq) => { res.json({ faq: faq }) })
})

router.post("/create", isAdmin, async (req, res) => {
    await Faq.create({
        question: req.body.question,
        question_en: req.body.question_en,
        question_ru: req.body.question_ru,
        answer: req.body.answer,
        answer_en: req.body.answer_en,
        answer_ru: req.body.answer_ru,
        checked: "1"
    }).then(() => {
        res.json({ success: "Sorag-jogap ustinlikli gosuldy" })
    }).catch((error) => { res.json({ error: error }) })
});

router.get("/edit/:faqId", isAdmin, async (req, res) => {
    await Faq.findOne({ where: { id: req.params.faqId } }).then((faq) => {
        res.json({ faq: faq })
    })
});

router.post("/edit/:faqId", isAdmin, async (req, res) => {
    await Faq.update({
        question: req.body.question,
        question_en: req.body.question_en,
        question_ru: req.body.question_ru,
        answer: req.body.answer,
        answer_en: req.body.answer_en,
        answer_ru: req.body.answer_ru,
        checked: req.body.checked
    }, { where: { id: req.params.faqId } })
        .then(() => { res.json({ success: "Ustunlikli uytgedildi" }) })
        .catch((error) => { res.json({ error: error }) })
});

router.delete("/delete/:faqId", isAdmin, async (req, res) => {
    await Faq.findOne({ where: { id: req.params.faqId } }).then((faq) => {
        if (faq) {
            faq.destroy()
            return res.json({ success: "Ustunlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});


module.exports = router;