const express = require("express");
const { isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
const { Contact } = require("../models/model");

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Contact.findAndCountAll({ limit, offset }).then((contacts) => {
        res.json({
            contacts: contacts.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: contacts.count,
                pages: Math.ceil(contacts.count / limit)
            }
        })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.post("/create", async (req, res) => {
    await Contact.create({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        comment: req.body.comment,
        phone_num: req.body.phone_num
    }).then(() => { res.json({ success: "Hatyňyz üstünlikli ugradyldy" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:contactId", isAdmin, async (req, res) => {
    await Contact.findOne({ where: { id: req.params.contactId } })
        .then((contact) => { res.json({ contact: contact }) })
});

router.post("/edit/:contactId", isAdmin, async (req, res) => {
    await Contact.update(
        {
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            comment: req.body.comment,
            phone_num: req.body.phone_num
        },
        { where: { id: req.params.contactId } }).then(() => { res.json({ success: "Üstünlikli üýtgedildi" }); })
        .catch((error) => { res.json({ error: error }) })
});

router.delete("/delete/:contactId", isAdmin, async (req, res) => {
    await Contact.findOne({ where: { id: req.params.contactId } }).then((contact) => {
        if (contact) {
            contact.destroy();
            return res.json({ success: "Teswir üstünlikli pozuldy" })
        } else { res.json({ error: "Hatyňyz tapylmady" }) }
    }).catch((error) => { res.status(500).json({ error }) })
});

module.exports = router;