const express = require("express")
const router = express.Router()
const { Tarif, Address, Region, Category, Internet, Service, Korporatiw, News, Program, Banner, Sponsor, Welayat, Faq, USSD, Galery, Popup } = require("../models/model")
const { Op } = require("sequelize");
const Sequelize = require('../data/db');

router.get("/tarif", async (req, res) => {
    await Tarif.findAll({
        attributes: { exclude: ['description_tm', 'description_en', 'description_ru', 'viewed', 'checked', 'createdAt', 'updatedAt', 'workerId'] },
        where: { checked: "1", status: "1" }
    }).then((tarifs) => { return res.json({ tarifs: tarifs }) })
});

router.get("/tarif/old", async (req, res) => {
    await Tarif.findAll({
        attributes: { exclude: ['description_tm', 'description_en', 'description_ru', 'viewed', 'checked', 'createdAt', 'updatedAt', 'workerId'] },
        where: { checked: "1", status: "0" }
    }).then((oldtarif) => { return res.json({ oldtarif: oldtarif }) })
});

router.get("/tarif/:tarifId", async (req, res) => {
    await Tarif.findAll({
        where: { id: req.params.tarifId, checked: "1" }
    }).then((tarif) => {
        Tarif.increment({ viewed: 1 }, { where: { id: req.params.tarifId } }).then(() => {
            return res.json({ tarif: tarif })
        })
    })
});

router.get("/korporatiw", async (req, res) => {
    await Korporatiw.findAll({
        attributes: { exclude: ['description_tm', 'description_en', 'description_ru', 'viewed', 'checked', 'createdAt', 'updatedAt', 'workerId'] },
        where: { checked: "1" }
    }).then((korporatiws) => { return res.json({ korporatiws: korporatiws }) })
});

router.get("/korporatiw/:korporatiwId", async (req, res) => {
    await Korporatiw.findAll({
        where: { id: req.params.korporatiwId, checked: "1" }
    }).then((korporatiw) => {
        Korporatiw.increment({ viewed: 1 }, { where: { id: req.params.korporatiwId } }).then(() => {
            return res.json({ korporatiw: korporatiw })
        })
    })
});


router.get("/internet", async (req, res) => {
    await Internet.findAll({
        attributes: { exclude: ['description_tm', 'description_en', 'description_ru', 'viewed', 'checked', 'createdAt', 'updatedAt', 'workerId'] },
        where: { checked: "1" }
    }).then((internets) => { return res.json({ internets: internets }) })
});

router.get("/internet/:internetId", async (req, res) => {
    await Internet.findAll({
        where: { id: req.params.internetId, checked: "1" }
    }).then((internet) => {
        Internet.increment({ viewed: 1 }, { where: { id: req.params.internetId } }).then(() => {
            return res.json({ internet: internet })
        })
    })
});


router.get("/service", async (req, res) => {
    await Service.findAll({
        attributes: { exclude: ['description_tm', 'description_en', 'description_ru', 'viewed', 'checked', 'createdAt', 'updatedAt', 'workerId'] },
        where: { checked: "1" }
    }).then((services) => { return res.json({ services: services }) })
});

router.get("/service/:serviceId", async (req, res) => {
    await Service.findAll({
        where: { id: req.params.serviceId, checked: "1" }
    }).then((service) => {
        Service.increment({ viewed: 1 }, { where: { id: req.params.serviceId } }).then(() => {
            return res.json({ service: service })
        })
    })
});


router.get("/region", async (req, res) => {
    await Region.findAll({ include: { model: Welayat } }).then((region) => { return res.json({ region: region }) })
});

router.get("/address", async (req, res) => {
    await Address.findAll(
        { include: { model: Region } },
        { where: { checked: "1" } }
    ).then((address) => {
        return res.json({ address: address })
    })
});


router.get("/category", async (req, res) => {
    Category.findAll({
        attributes: {
            include: [[Sequelize.fn("COUNT", Sequelize.col("news.id")), "NewsCount"]]
        },
        include: [{
            model: News, attributes: []
        }],
        group: ['category.id']
    }).then((category) => {
        return res.json({ category: category })
    })
});


router.get("/news", async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const search = req.query.search || "";
    const limit = 8;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await News.findAndCountAll({
        offset,
        limit,
        include: { model: Category, attributes: ['name_tm', "name_ru", "name_en"] },
        order: [
            ["id", "DESC"]
        ],
        where: {
            checked: "1",
            [Op.or]: [
                { title_tm: { [Op.like]: '%' + search + '%' } },
                { title_ru: { [Op.like]: '%' + search + '%' } },
                { title_en: { [Op.like]: '%' + search + '%' } },
                { description_tm: { [Op.like]: '%' + search + '%' } },
                { description_ru: { [Op.like]: '%' + search + '%' } },
                { description_en: { [Op.like]: '%' + search + '%' } }
            ]
        }
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

router.get("/banner_news", async (req, res) => {
    await News.findAll({
        limit: 6,
        include: { model: Category },
        order: [
            ['createdAt', 'DESC']
        ],
        where: { checked: "1" }
    }).then((all_news) => {
        return res.json({ all_news: all_news })
    })
})

router.get("/news/most", async (req, res) => {
    await News.findAll({
        limit: 3,
        include: { model: Category },
        order: [
            ['viewed', 'DESC']
        ]
    }).then((news) => {
        if (news) {
            return res.json({ news: news })
        } else { return res.json({ error: "Tazelik tapylmady!" }) }
    })
})

router.get("/news/:newsId", async (req, res) => {
    await News.findAll({
        include: { model: Category },
        where: { id: req.params.newsId, checked: "1" }
    }).then((news) => {
        News.increment({ viewed: 1 }, { where: { id: req.params.newsId } }).then(() => {
            return res.json({ news: news })
        })
    })
});

router.get("/news/category/:categoryId", async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 8;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await News.findAndCountAll({
        offset,
        limit,
        include: { model: Category },
        where: { categoryId: req.params.categoryId }
    }).then((news) => {
        return res.json({
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

router.get("/news/date/:date", async (req, res) => {
    await News.findAll({ include: { model: Category }, where: { created_at: req.params.date } }).then((news) => {
        if (news) {
            return res.json({ news: news })
        } else { res.json({ error: "Tazelik tapylmady!" }) }
    })
})

router.get("/program", async (req, res) => {
    await Program.findAll({ where: { checked: "1" } }).then((programs) => {
        return res.json({ programs: programs })
    })
});

router.get("/program/:programId", async (req, res) => {
    await Program.findAll({
        where: {
            id: req.params.programId,
            checked: "1"
        }
    }).then((program) => {
        Program.increment({ viewed: 1 }, { where: { id: req.params.programId } }).then(() => {
            return res.json({ program: program })
        })
    })
});

router.get("/banner", async (req, res) => {
    await Banner.findAll({ where: { checked: "1" } }).then((banners) => {
        return res.json({ banners: banners })
    })
});


router.get("/sponsor", async (req, res) => {
    await Sponsor.findAll({ where: { checked: "1" } }).then((sponsors) => {
        return res.json({ sponsors: sponsors })
    })
});

router.get("/faq", async (req, res) => {
    await Faq.findAll({ where: { checked: "1" } }).then((faq) => {
        return res.json({ faq: faq })
    })
});

router.get("/ussd", async (req, res) => {
    await USSD.findAll({ where: { checked: "1" } }).then((ussd) => {
        return res.json({ ussd: ussd })
    })
});

router.get("/galery", async (req, res) => {
    await Galery.findAll({ where: { checked: "1" } }).then((image) => {
        return res.json({ image: image })
    })
});

router.get("/popup", async (req, res) => {
    await Popup.findAll({ where: { checked: "1" } }).then((popup) => {
        return res.json({ popup: popup })
    })
});

module.exports = router;