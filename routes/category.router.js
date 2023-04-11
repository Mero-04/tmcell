const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Category } = require("../models/model");

//superADMIN start
router.get("/", isAdmin, async (req, res) => {
    await Category.findAll()
        .then((category) => {
            res.json({ category: category })
        })
})

router.post("/create", isAdmin, async (req, res) => {
    await Category.create({
        name: req.body.name
    }).then(() => {
        res.json({
            success: "Kategoriya ustinlikli gosuldy"
        })
    }).catch((error) => {
        res.json({ error: error })
    })
});

router.get("/edit/:categoryId", isAdmin, async (req, res) => {
    await Category.findOne({
        where: { id: req.params.categoryId }
    }).then((category) => {
        res.json({
            category: category
        })
    })
});

router.post("/edit/:categoryId", isAdmin, async (req, res) => {
    await Category.update({
        name: req.body.name
    },
        { where: { id: req.params.categoryId } })
        .then(() => {
            res.json({
                success: "Ustunlikli uytgedildi"
            })
        })
        .catch((error) => {
            res.json({ error: error })
        })
});

router.delete("/delete/:categoryId", isAdmin, async (req, res) => {
    await Category.findOne({ where: { id: req.params.categoryId } })
        .then((category) => {
            if (category) {
                category.destroy()
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





module.exports = router;