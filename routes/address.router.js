const express = require('express');
const { isAdmin, isAddress } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Address, Region } = require("../models/model");

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Address.findAndCountAll({
        limit,
        offset,
        include: { model: Region, attributes: ['id', 'name_tm'] }
    }).then((addresses) => {
        res.json({
            addresses: addresses.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: addresses.count,
                pages: Math.ceil(addresses.count / limit)
            }
        })
    })
})

router.get("/create", isAdmin, async (req, res) => {
    await Region.findAll().then((region) => { res.json({ region: region }) })
});

router.post("/create", isAdmin, async (req, res) => {
    await Address.create({
        title_tm: req.body.title_tm,
        title_en: req.body.title_en,
        title_ru: req.body.title_ru,
        phone_num: req.body.phone_num,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        open_time: req.body.open_time,
        close_time: req.body.close_time,
        regionId: req.body.regionId,
        checked: "1"
    }).then(() => {
        res.json({ success: "Salgy üstünlikli goşuldy" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.get("/edit/:addressId", isAdmin, async (req, res) => {
    await Address.findOne({
        include: { model: Region, attributes: ['id', 'name_tm', 'name_en', 'name_ru'] },
        where: { id: req.params.addressId }
    }).then((address) => { res.json({ address: address }) })
});

router.post("/edit/:addressId", isAdmin, async (req, res) => {
    await Address.update({
        title_tm: req.body.title_tm,
        title_en: req.body.title_en,
        title_ru: req.body.title_ru,
        phone_num: req.body.phone_num,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        open_time: req.body.open_time,
        close_time: req.body.close_time,
        checked: req.body.checked,
        regionId: req.body.regionId,
    }, { where: { id: req.params.addressId } }).then(() => {
        res.json({ success: "Üstünlikli üýtgedildi" })
    }).catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:addressId", isAdmin, async (req, res) => {
    await Address.findOne({ where: { id: req.params.addressId } })
        .then((address) => {
            if (address) {
                address.destroy()
                return res.json({ success: "Üstünlikli pozuldy" })
            } else {
                res.json({ error: "Tapylmady" })
            }
        })
});



module.exports = router;