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
        include: { model: Region, attributes: ['id', 'name'] }
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
    await Region.findAll().then((region) => {
        res.json({ region: region })
    })
});

router.post("/create", isAdmin, async (req, res) => {
    if (!req.body.title) {
        res.json({ error: "error" })
    } else {
        await Address.create({
            title: req.body.title,
            phone_num: req.body.phone_num,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            open_time: req.body.open_time,
            close_time: req.body.close_time,
            regionId: req.body.regionId,
            checked: "1"
        }).then(() => {
            res.json({
                success: "Salgy ustinlikli gosuldy"
            })
        }).catch((error) => {
            res.json({ error: error })
        })
    }

});

router.get("/edit/:addressId", isAdmin, async (req, res) => {
    await Address.findOne({
        where: { id: req.params.addressId },
        include: { model: Region, attributes: ['id', 'name'] }
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
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        open_time: req.body.open_time,
        close_time: req.body.close_time,
        checked: req.body.checked,
        regionId: req.body.regionId,
    }, { where: { id: req.params.addressId } }).then(() => {
        res.json({
            success: "Ustunlikli uytgedildi"
        })
    }).catch((error) => {
        res.json({ error: error })
    })
});

router.delete("/delete/:addressId", isAdmin, async (req, res) => {
    await Address.findOne({ where: { id: req.params.addressId } })
        .then((address) => {
            if (address) {
                address.destroy()
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



//workerADMIN start
// router.get("/worker", isAddress, async (req, res) => {
//     const page = req.query.page ? parseInt(req.query.page) : 1;
//     const size = 10;
//     const offset = (page - 1) * size;
//     const limit = page * size;
//     var before = offset > 0 ? page - 1 : 1;
//     var next = page + 1;
//     await Address.findAndCountAll({
//         limit,
//         offset,
//         where: req.user.role == "Address" ? { workerId: req.user.id } : null,
//         include: { model: Region, attributes: ['id', 'name'] }
//     })
//         .then((addresses) => {
//             res.json({
//                 addresses: addresses.rows,
//                 pagination: {
//                     before: before,
//                     next: next,
//                     page: page,
//                     total: addresses.count,
//                     pages: Math.ceil(addresses.count / size)
//                 }
//             })
//         })
// })

// router.get("/worker/create", isAddress, async (req, res) => {
//     await Region.findAll().then((region) => {
//         res.json({ region: region })
//     })
// });

// router.post("/worker/create", isAddress, async (req, res) => {
//     await Address.create({
//         title: req.body.title,
//         phone_num: req.body.phone_num,
//         open_time: req.body.open_time,
//         close_time: req.body.close_time,
//         regionId: req.body.regionId,
//         workerId: req.user.id
//     }).then(() => {
//         res.json({
//             success: "Salgy ustinlikli gosuldy"
//         })
//     })
// });

// router.get("/worker/edit/:addressId", isAddress, async (req, res) => {
//     await Address.findOne({
//         where: {
//             id: req.params.addressId,
//             workerId: req.user.id
//         }
//     }).then((address) => {
//         res.json({
//             address: address
//         })
//     })
// });

// router.post("/worker/edit/:addressId", isAddress, async (req, res) => {
//     await Address.update({
//         title: req.body.title,
//         phone_num: req.body.phone_num,
//         open_time: req.body.open_time,
//         close_time: req.body.close_time,
//         regionId: req.body.regionId,
//         workerId: req.user.id
//     },
//         {
//             where: {
//                 id: req.params.addressId,
//                 workerId: req.user.id
//             }
//         })
//         .then(() => {
//             res.json({
//                 success: "Ustunlikli uytgedildi"
//             })
//         })
// });

// router.delete("/worker/delete/:addressId", isAddress, async (req, res) => {
//     await Address.findOne({
//         where: {
//             id: req.params.addressId,
//             workerId: req.user.id
//         }
//     })
//         .then((address) => {
//             if (address) {
//                 address.destroy()
//                 return res.json({
//                     success: "Ustunlikli pozuldy"
//                 })
//             } else {
//                 res.json({
//                     error: "Tapylmady"
//                 })
//             }
//         })
// });
//workerADMIN end



module.exports = router;