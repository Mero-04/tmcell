const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Worker } = require("../models/model");
const { isAdmin } = require("../middlewares/authMiddleware");

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Worker.findAndCountAll({ limit, offset }).then((worker) => {
        res.json({
            worker: worker.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: worker.count,
                pages: Math.ceil(worker.count / limit)
            }
        })
    })
});

router.post("/create", isAdmin, async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    await Worker.create({
        name: req.body.name,
        email: req.body.email,
        phone_num: req.body.phone_num,
        password: hash,
        role: req.body.role
    }).then(() => { res.json({ success: "Isgar üstünlikli goşuldy" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:workerId", isAdmin, async (req, res) => {
    await Worker.findOne({ where: { id: req.params.workerId } }).then((worker) => {
        res.json({ worker: worker })
    })
});

router.post("/edit/:workerId", isAdmin, async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    await Worker.update({
        name: req.body.name,
        email: req.body.email,
        phone_num: req.body.phone_num,
        password: hash,
        role: req.body.role,
        checked: req.body.checked
    }, { where: { id: req.params.workerId } }).then(() => {
        res.json({ success: "Üstünlikli üytgedildi" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:workerId", isAdmin, async (req, res) => {
    await Worker.findOne({ id: req.params.workerId }).then((worker) => {
        if (worker) {
            worker.destroy()
            res.json({ success: "Üstünlikli pozuldy" })
        } res.json({ error: "Tapylmady" })
    })
});

module.exports = router;