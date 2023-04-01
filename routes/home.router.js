const express = require("express")
const router = express.Router()
const { Tarif, Address, Region, Category, Internet, Service, Korporatiw, News, Contact } = require("../models/model")


//tarif_nyrhnama
router.get("/tarif", async (req, res) => {
    await Tarif.findAll({ where: { checked: "1" , status: "1"} }).then((tarifs) => {
        res.json({ tarifs: tarifs })
    })
});

router.get("/tarif/old", async (req, res) => {
    await Tarif.findAll({ where: { checked: "1", status: "0" } }).then((tarif) => {
        res.json({ oldtarif: oldtarif })
    })
});

router.get("/tarif/:tarifId", async (req, res) => {
    await Tarif.findAll({
        where: {
            id: req.params.tarifId,
            checked: "1"
        }
    }).then((tarif) => {
        res.json({ tarif: tarif })
    })
});
//tarif_nyrhnama


//korporatiw
router.get("/korporatiw", async (req, res) => {
    await Korporatiw.findAll({ where: { checked: "1" } }).then((korporatiws) => {
        res.json({ korporatiws: korporatiws })
    })
});

router.get("/korporatiw/:korporatiwId", async (req, res) => {
    await Korporatiw.findAll({
        where: {
            id: req.params.korporatiwId,
            checked: "1"
        }
    }).then((korporatiw) => {
        res.json({ korporatiw: korporatiw })
    })
});
//korporatiw


//internet
router.get("/internet", async (req, res) => {
    await Internet.findAll({ where: { checked: "1" } }).then((internets) => {
        res.json({ internets: internets })
    })
});

router.get("/internet/:internetId", async (req, res) => {
    await Internet.findAll({
        where: {
            id: req.params.internetId,
            checked: "1"
        }
    }).then((internet) => {
        res.json({ internet: internet })
    })
});
//internet


//service
router.get("/service", async (req, res) => {
    await Service.findAll({ where: { checked: "1" } }).then((services) => {
        res.json({ services: services })
    })
});

router.get("/service/:serviceId", async (req, res) => {
    await Service.findAll({
        where: {
            id: req.params.serviceId,
            checked: "1"
        }
    }).then((service) => {
        res.json({ service: service })
    })
});
//service


///Adresss
router.get("/region", async (req, res) => {
    await Region.findAll()
        .then((region) => {
            res.json({ region: region })
        })
});

router.get("/address", async (req, res) => {
    await Address.findAll(
        { where: { checked: "1" } },
        { include: { model: Region, attributes: ['id', 'name'] } }
    )
        .then((address) => {
            res.json({ address: address })
        })
});
///Adresss


///News
router.get("/category", async (req, res) => {
    await Category.findAll()
        .then((category) => {
            res.json({ category: category })
        })
});

router.get("/news", async (req, res) => {
    await News.findAll({
        where: { checked: "1" },
        include: { model: Category, attributes: ['id', 'name'] }
    }).then((news) => {
        res.json({ news: news })
    })
})

router.get("/news/:newsId", async (req, res) => {
    await News.findAll({
        where: {
            id: req.params.newsId,
            checked: "1"
        }
    }).then((news) => {
        res.json({ news: news })
    })
});
///News


module.exports = router;