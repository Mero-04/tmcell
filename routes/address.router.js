const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Address, Region } = require("../models/model");

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = 10;
    const offset = (page - 1) * size;
    const limit = page * size;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Address.findAndCountAll({
        limit,
        offset,
        include: { model: Region, attributes: ['id', 'name'] }
    })
        .then((addresses) => {
            res.json({
                addresses: addresses.rows,
                pagination: {
                    before: before,
                    next: next,
                    page: page,
                    total: addresses.count,
                    pages: Math.ceil(addresses.count / size)
                }
            })
        })
})

router.post("/create", isAdmin, async (req, res) => {
    await Address.create({
        title: req.body.title,
        phone_num: req.body.phone_num,
        open_time: req.body.open_time,
        close_time: req.body.close_time,
        regionId: req.body.regionId,
    }).then(() => {
        res.json({
            success: true,
            message: "Salgy ustinlikli gosuldy"
        })
    })
});

router.get("/edit/:addressId", isAdmin, async (req, res) => {
    await Address.findOne({
        where: { id: req.params.addressId }
    }).then((address) => {
        res.json({
            address: address
        })
    })
});

router.post("/edit/:addressId", isAdmin, async (req, res) => {
    await Address.update({
        title: req.body.title,
        phone_num: req.body.phone_num,
        open_time: req.body.open_time,
        close_time: req.body.close_time,
        regionId: req.body.regionId,
    },
        { where: { id: req.params.addressId } })
        .then(() => {
            res.json({
                success: true,
                message: "Ustunlikli uytgedildi"
            })
        })
});

router.delete("/delete/:addressId", isAdmin, async (req, res) => {
    await Address.findOne({ where: { id: req.params.addressId } })
        .then((address) => {
            if (address) {
                address.destroy()
                return res.json({
                    success: true,
                    message: "Ustunlikli pozuldy"
                })
            } else {
                res.json({
                    success: false,
                    message: "Tapylmady"
                })
            }
        })
});
//superADMIN end





module.exports = router;