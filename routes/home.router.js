const express = require("express")
const router = express.Router()
const { Tarif, Address, Region, Category, Internet, Service, Korporatiw, News, Program, Banner, Sponsor, Welayat,Faq, USSD } = require("../models/model")
const { Op } = require("sequelize");
router.get("/tarif", async (req, res) => {
    await Tarif.findAll({ where: { checked: "1", status: "1" } }).then((tarifs) => { res.json({ tarifs: tarifs }) })
});

router.get("/tarif/old", async (req, res) => {
    await Tarif.findAll({ where: { checked: "1", status: "0" } }).then((oldtarif) => { res.json({ oldtarif: oldtarif }) })
});

router.get("/tarif/:tarifId", async (req, res) => {
    await Tarif.findAll({
        where: { id: req.params.tarifId, checked: "1" }
    }).then((tarif) => { res.json({ tarif: tarif }) })
});


router.get("/korporatiw", async (req, res) => {
    await Korporatiw.findAll({ where: { checked: "1" } }).then((korporatiws) => { res.json({ korporatiws: korporatiws }) })
});

router.get("/korporatiw/:korporatiwId", async (req, res) => {
    await Korporatiw.findAll({
        where: { id: req.params.korporatiwId, checked: "1" }
    }).then((korporatiw) => { res.json({ korporatiw: korporatiw }) })
});


router.get("/internet", async (req, res) => {
    await Internet.findAll({ where: { checked: "1" } }).then((internets) => { res.json({ internets: internets }) })
});

router.get("/internet/:internetId", async (req, res) => {
    await Internet.findAll({
        where: { id: req.params.internetId, checked: "1" }
    }).then((internet) => { res.json({ internet: internet }) })
});


router.get("/service", async (req, res) => {
    await Service.findAll({ where: { checked: "1" } }).then((services) => { res.json({ services: services }) })
});

router.get("/service/:serviceId", async (req, res) => {
    await Service.findAll({
        where: { id: req.params.serviceId, checked: "1" }
    }).then((service) => { res.json({ service: service }) })
});


router.get("/region", async (req, res) => {
    await Region.findAll({ include: { model: Welayat, attributes: ['id', 'name'] } }).then((region) => { res.json({ region: region }) })
});

router.get("/address", async (req, res) => {
    await Address.findAll(
        { include: { model: Region, attributes: ['id', 'name'] } },
        { where: { checked: "1" } }
    ).then((address) => {
        res.json({ address: address })
    })
});


router.get("/category", async (req, res) => {
    await Category.findAll().then((category) => { res.json({ category: category }) })
});



router.get("/news", async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const search = req.query.search || "";
    const limit = 8;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await News.findAndCountAll({
        offset, limit,
        include: { model: Category},
        where: { checked: "1", [Op.or]: [{ title: { [Op.like]: '%' + search + '%' } }, { description: { [Op.like]: '%' + search + '%' } }] }
    }).then((news) => {
        res.json({
            news: news.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: news.count,
                pages: Math.ceil(news.count / limit)
            }
        })
    })
})


router.get("/news/:newsId", async (req, res) => {
    await News.findAll({
        include: { model: Category},
        where: { id: req.params.newsId, checked: "1" }
    }).then((news) => {
        News.increment({ viewed: 1 }, { where: { id: req.params.newsId } }).then(() => {
            res.json({ news: news })
        })
    })
});

router.get("/news/category/:categoryId", async (req, res) => {
    await News.findAll({
        include: { model: Category },
        where: { categoryId: req.params.categoryId }
    }).then((news) => { res.json({ news: news }) })
})

router.get("/news/date/:date", async (req, res) => {
    await News.findOne({ where: { created_at: req.params.date } }).then((news) => {
        if (news) {
            res.json({ news: news })
        } else { res.json({ error: "Tazelik tapylmady!" }) }
    })
})

router.get("/program", async (req, res) => {
    await Program.findAll({ where: { checked: "1" } }).then((programs) => {
        res.json({ programs: programs })
    })
});

router.get("/program/:programId", async (req, res) => {
    await Program.findAll({
        where: {
            id: req.params.programId,
            checked: "1"
        }
    }).then((program) => {
        res.json({ program: program })
    })
});

router.get("/banner", async (req, res) => {
    await Banner.findAll({ where: { checked: "1" } }).then((banners) => {
        res.json({ banners: banners })
    })
});


router.get("/sponsor", async (req, res) => {
    await Sponsor.findAll({ where: { checked: "1" } }).then((sponsors) => {
        res.json({ sponsors: sponsors })
    })
});

router.get("/faq", async (req, res) => {
    await Faq.findAll({ where: { checked: "1" } }).then((faq) => {
        res.json({ faq: faq })
    })
});

router.get("/ussd", async (req, res) => {
    await USSD.findAll({ where: { checked: "1" } }).then((ussd) => {
        res.json({ ussd: ussd })
    })
});



module.exports = router;