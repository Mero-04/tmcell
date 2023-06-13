const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Email } = require("../models/model");
const emailService = require("../helpers/send-mail");
const axios = require("axios")

router.get("/", isAdmin, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    var before = offset > 0 ? page - 1 : 1;
    var next = page + 1;
    await Email.findAndCountAll({ limit, offset }).then((emails) => {
        res.json({
            emails: emails.rows,
            pagination: {
                before: before,
                next: next,
                page: page,
                total: emails.count,
                pages: Math.ceil(emails.count / limit)
            }
        })
    })
})
router.post("/create", async (req, res) => {
    const token = req.body.token;
    const email = req.body.email;
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY_CAPTCHA}&response=${token}`
        );

        if (response.data.success) {
            await Email.create({
                email: req.body.email
            }).then(async () => {
                emailService.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Altyn Asyr ýapyk görnüşli paýdarlar jemgyýeti",
                    html: `<!DOCTYPE html>
                    <html lang="en">
                    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                    
                    <head></head>
                    
                    <body style="background-color:#f6f9fc;font-family:Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
                        <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%"
                            style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
                            <tr style="width:100%">
                                <td>
                                    <table style="padding:0 48px" align="center" border="0" cellPadding="0" cellSpacing="0"
                                        role="presentation" width="100%">
                                        <tbody>
                                            <tr>
                                                <td><img alt="TMCELL" src="https://tmcell.tm/static/media/logo.91ef484ec8983a3b9790.png"
                                                        width="200" height="57"
                                                        style="display:block;outline:none;border:none;text-decoration:none;text-align:center" />
                                                    <hr
                                                        style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                                                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#48494d;text-align:left">
                                                        Salam!</p>
                                                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#48494d;text-align:left">
                                                        &quot;Altyn Asyr&quot; Ýapyk görnüşli paýdarlar jemgyýetine hoş geldiňiz! Siz abuna
                                                        ýazylmak bilen kärhananyň täze <a target="_blank"
                                                            style="color:#556cd6;text-decoration:none"
                                                            href="https://tmcell.tm/nyrhnamalar">nyrhnamalary,</a>
                                                        <a target="_blank" style="color:#556cd6;text-decoration:none"
                                                            href="https://tmcell.tm/hyzmatlar">hyzmatlary</a>
                                                        we
                                                        <a target="_blank" style="color:#556cd6;text-decoration:none"
                                                            href="https://tmcell.tm/internet">internet bukjalary</a> barada ilkinji bolup
                                                        habarly bolarsyňyz.
                                                    </p>
                                                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#48494d;text-align:left">
                                                        Biz bilen galýanyňyz üçin sag boluň!</p>
                                                    <hr
                                                        style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                                                    <p style="font-size:12px;line-height:16px;margin:16px 0;color:#8898aa">TMCELL © 217 Oguzhan köçesi, Aşgabat şäheri, 744000</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    
                    </html>`,
                })
            }).then(() => { res.json({ success: "E-poctanyz üstünlikli ugradyldy!" }) }).catch((error) => { res.status(500).json({ error: error }) })
        } else {
            res.json({ error: "Captcha yalňyş!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Näsazlyk yüze çykdy!" });
    }
})


router.get("/edit/:emailId", isAdmin, async (req, res) => {
    await Email.findOne({ where: { id: req.params.emailId } }).then((email) => {
        res.json({ email: email })
    })
});

router.post("/edit/:emailId", isAdmin, async (req, res) => {
    await Email.update({
        email: req.body.email
    }, { where: { id: req.params.emailId } })
        .then(() => { res.json({ success: "Üstünlikli üýtgedildi" }) })
        .catch((error) => { res.status(500).json({ error: error }) })
});

router.delete("/delete/:emailId", isAdmin, async (req, res) => {
    await Email.findOne({ where: { id: req.params.emailId } }).then((email) => {
        if (email) {
            email.destroy()
            return res.json({ success: "Üstünlikli pozuldy" })
        } else { res.json({ error: "Tapylmady" }) }
    })
});


module.exports = router;