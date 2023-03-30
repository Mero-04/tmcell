const express = require('express');
const { isAdmin, isInternet } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Internet } = require("../models/model");

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Internet.findAndCountAll({
        limit,
        offset
    })
        .then((internets) => {
            res.json({
                internets: internets.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: internets.count,
                    pages: Math.ceil(internets.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, async (req, res) => {
    await Internet.create({
        title: req.body.title,
        volume: req.body.volume,
        price: req.body.price,
        description: req.body.description,
        connect_USSD: req.body.connect_USSD
    }).then(() => {
        res.json({
            success: "Internet nyrhnamasy ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:internetId", isAdmin, async (req, res) => {
    await Internet.findOne({
        where: { id: req.params.internetId }
    }).then((internet) => {
        res.json({
            internet: internet
        })
    })
});

router.post("/edit/:internetId", isAdmin, async (req, res) => {
    await Internet.update({
        title: req.body.title,
        volume: req.body.volume,
        price: req.body.price,
        description: req.body.description,
        checked: req.body.checked,
        connect_USSD: req.body.connect_USSD
    },
        { where: { id: req.params.internetId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:internetId", isAdmin, async (req, res) => {
    await Internet.findOne({ where: { id: req.params.internetId } })
        .then((internet) => {
            if (internet) {
                internet.destroy()
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
router.get("/worker", isInternet, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Internet.findAndCountAll({
        limit,
        offset,
        where: req.user.role == "Internet" ? { workerId: req.user.id } : null
    })
        .then((internets) => {
            res.json({
                internets: internets.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: internets.count,
                    pages: Math.ceil(internets.count / size)
                }
            })
        })
})

router.post("/worker/create", isInternet, async (req, res) => {
    await Internet.create({
        title: req.body.title,
        volume: req.body.volume,
        price: req.body.price,
        description: req.body.description,
        connect_USSD: req.body.connect_USSD,
        workerId: req.user.id
    }).then(() => {
        res.json({
            success: "Internet nyrhnamasy ustinlikli gosuldy"
        })
    })
});

router.get("/worker/edit/:internetId", isInternet, async (req, res) => {
    await Internet.findOne({
        where: {
            id: req.params.internetId,
            workerId: req.user.id
        }
    }).then((internet) => {
        res.json({
            internet: internet
        })
    })
});

router.post("/worker/edit/:internetId", isInternet, async (req, res) => {
    await Internet.update({
        title: req.body.title,
        volume: req.body.volume,
        price: req.body.price,
        description: req.body.description,
        connect_USSD: req.body.connect_USSD,
        workerId: req.user.id
    },
        {
            where: {
                id: req.params.internetId,
                workerId: req.user.id
            }
        })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/worker/delete/:internetId", isInternet, async (req, res) => {
    await Internet.findOne({
        where: {
            id: req.params.internetId,
            workerId: req.user.id
        }
    })
        .then((internet) => {
            if (internet) {
                internet.destroy()
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