const express = require("express");
const router = express.Router();
const { Tarif, Internet, Korporatiw, Program, Service } = require("../models/model");
const { isAdmin } = require("../middlewares/authMiddleware");

router.get("/", isAdmin, async (req, res) => {
    await Tarif.findAll({ attributes: ['id', 'title_tm', 'viewed'] }).then((tarif) => {
        Korporatiw.findAll({ attributes: ['id', 'title_tm', 'viewed'] }).then((korporatiw) => {
            Internet.findAll({ attributes: ['id', 'title_tm', 'viewed'] }).then((internet) => {
                Service.findAll({ attributes: ['id', 'title_tm', 'viewed'] }).then((service) => {
                    Program.findAll({ attributes: ['id', 'title_tm', 'viewed'] }).then((program) => {
                        res.json({
                            korporatiw: korporatiw,
                            tarif: tarif,
                            program: program,
                            internet: internet,
                            service: service
                        })
                    })
                })
            })
        })
    })
});
module.exports = router;