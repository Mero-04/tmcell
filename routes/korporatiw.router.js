const express = require('express');
const { isAdmin, isTariff } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Korporatiw } = require("../models/model");


//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Korporatiw.findAndCountAll({
        limit,
        offset
    })
        .then((korporatiws) => {
            res.json({
                korporatiws: korporatiws.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: korporatiws.count,
                    pages: Math.ceil(korporatiws.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, async (req, res) => {
    await Korporatiw.create({
        title: req.body.title,
        description: req.body.description,
        icon: req.user.icon
    }).then(() => {
        res.json({
            success: "Korporatiw nyrhnama ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:korporatiwId", isAdmin, async (req, res) => {
    await Korporatiw.findOne({
        where: { id: req.params.korporatiwId }
    }).then((korporatiw) => {
        res.json({
            korporatiw: korporatiw
        })
    })
});

router.post("/edit/:korporatiwId", isAdmin, async (req, res) => {
    await Korporatiw.update({
        title: req.body.title,
        description: req.body.description,
        checked: req.body.checked,
        icon: req.body.icon,
        img: img
    },
        { where: { id: req.params.korporatiwId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:korporatiwId", isAdmin, async (req, res) => {
    await Korporatiw.findOne({ where: { id: req.params.korporatiwId } })
        .then((korporatiw) => {
            if (korporatiw) {
                korporatiw.destroy()
                return res.json({
                    success: "Ustunlikli pozuldy"
                })
            } else {
                res.json({
                    error: "Tapylmady"
                })
            }
        })
});
//superADMIN end




//workerADMIN start
router.get("/", isTariff, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Korporatiw.findAndCountAll({
        limit,
        offset,
        where: req.user.role == "Nyrhnama" ? { workerId: req.user.id } : null
    })
        .then((korporatiws) => {
            res.json({
                korporatiws: korporatiws.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: korporatiws.count,
                    pages: Math.ceil(korporatiws.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, async (req, res) => {
    await Korporatiw.create({
        title: req.body.title,
        description: req.body.description,
        icon: req.user.icon,
        workerId: req.user.id
    }).then(() => {
        res.json({
            success: "Korporatiw nyrhnama ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:korporatiwId", isTariff, async (req, res) => {
    await Korporatiw.findOne({
        where: {
            id: req.params.korporatiwId,
            workerId: req.user.id
        }
    }).then((korporatiw) => {
        res.json({
            korporatiw: korporatiw
        })
    })
});

router.post("/edit/:korporatiwId", isTariff, async (req, res) => {
    await Korporatiw.update({
        title: req.body.title,
        description: req.body.description,
        icon: req.body.icon,
        workerId: req.user.id
    },
        { where: { id: req.params.korporatiwId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:korporatiwId", isTariff, async (req, res) => {
    await Korporatiw.findOne({ where: { id: req.params.korporatiwId } })
        .then((korporatiw) => {
            if (korporatiw) {
                korporatiw.destroy()
                return res.json({
                    success: "Ustunlikli pozuldy"
                })
            } else {
                res.json({
                    error: "Tapylmady"
                })
            }
        })
});
//workerADMIN end



module.exports = router;