const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { News, Category } = require('../models/model');
const RSS = require('rss');

const feed = new RSS({
    title: "Altyn Asyr ýapyk görnüşli paýdarlar jemgyýeti",
    description: "Gün geçdigi saýy özgerýän, ösýän, ahli ugurlarda diňe üstünlik gazanýan, gysga wagtyň içinde özüni dünýä ykrar etdirmegi başaran, bäş müňýyllyk geçmiş taryhynda alem - jahany haýran  eden ata - watanymyz Türkmenistan häzirki wagtda hem dünýäni haýrana goýmagy başarýar.Gahryman Arkadagymyz ýurt başyna geçen ilkinji günlerinden başlap, Döwlet adam üçindir diýen şyragy öňe sürdi.Halkyň eşretli durmuşda ýaşamagy üçin bimöçber aladalar edilýän ýurtda halka ösen derejede hyzmat etmeklik hem barha güýçlenýär",
    image_url: process.env.HOSTNAME + '/api/img/theme/logo.png',
    feed_url: "www.tmcell.tm/rss",
    site_url: "www.tmcell.tm",
});

router.get("/", async (req, res) => {
    await News.findAll({
        limit: 10,
        include: { model: Category },
        order: [
            ['id', 'DESC']
        ],
        where: { checked: 1 }
    }).then((news) => {
        news.map((newss) => {
            feed.item({
                title: newss.title_tm,
                description: newss.description_tm,
                url: 'https://tmcell.tm/tazelikler/' + newss.id,
                guid: 'www.tmcell.tm/rss',
                date: newss.createdAt,
                enclosure: {
                    'url': process.env.HOSTNAME + 'api/img/news/' + newss.news_img,
                    'type': 'image/jpeg'
                }
            });
            res.set('Content-Type', 'text/xml');
            res.send(feed.xml({ indent: true }))
        })

    })


});



module.exports = router;