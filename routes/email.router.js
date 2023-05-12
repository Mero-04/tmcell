const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Email } = require("../models/model");
const emailService = require("../helpers/send-mail");
const axios = require("axios")

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Email.findAndCountAll({ limit, offset }).then((emails) => {
        res.json({
            emails: emails.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: emails.count,
                pages: Math.ceil(emails.count / limit)
            }
        })
    })
})
router.post("/create", async (req, res) => {
    const token = req.body.token;
    const email = req.body.email;
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY_CAPTCHA}&response=${token}`
        );

        if (response.data.success) {
            await Email.create({
                email: req.body.email
            }).then(async () => {
                emailService.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Altyn Asyr ýapyk görnüşli paýdarlar jemgyýeti",
                    html: '<b>Salam, siz</b> <a href="https://tmcell.tm">Tmcell.tm</a><b> sahypasyna abuna ýazyldyňyz! Siz abuna ýazylmak bilen Altyn Asyr ýapyk görnüşli paýdarlar jemgyýetiniň hödürleýän täze hyzmatlary bilen tanyşyp bilersiniz.</b>',
                })
            }).then(() => { res.json({ success: "E-poctanyz üstünlikli ugradyldy!" }) }).catch((error) => { res.status(500).json({ error: error }) })
        } else {
            res.json({ error: "Captcha yalňyş!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Näsazlyk yüze çykdy!" });
    }
})


router.get("/edit/:emailId", isAdmin, async (req, res) => {
    await Email.findOne({ where: { id: req.params.emailId } }).then((email) => {
        res.json({ email: email })
    })
});

router.post("/edit/:emailId", isAdmin, async (req, res) => {
    await Email.update({
        email: req.body.email
    }, { where: { id: req.params.emailId } })
        .then(() => { res.json({ success: "Üstünlikli üýtgedildi" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:emailId", isAdmin, async (req, res) => {
    await Email.findOne({ where: { id: req.params.emailId } }).then((email) => {
        if (email) {
            email.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});


module.exports = router;