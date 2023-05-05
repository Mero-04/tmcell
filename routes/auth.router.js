const express = require('express');
const router = express.Router();
const { Admin, Worker } = require('../models/model');
const { sign } = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { validateToken } = require("../middlewares/authMiddleware");

router.post("/rootman", async (req, res) => {
    const { email, password } = req.body;
    await Admin.findOne({ where: { email: email } })
        .then(admin => {
            if (!admin || admin.email !== email) {
                res.json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" })
            } else {
                var passwordIsValid = bcrypt.compareSync(password, admin.password)
                if (!passwordIsValid) {
                    res.json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" })
                } else {
                    res.json({
                        token: sign({ id: admin.id, role: admin.role }, process.env.JWT_key, {
                            expiresIn: '24h'
                        })
                    });
                }
            }
        })
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    await Worker.findOne({ where: { email: email } })
        .then(worker => {
            if (!worker || worker.email !== email) {
                res.json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" })
            } else {
                var passwordIsValid = bcrypt.compareSync(password, worker.password)
                if (!passwordIsValid) {
                    res.json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" })
                } else {
                    res.json({
                        token: sign({ id: worker.id, role: worker.role }, process.env.JWT_key, {
                            expiresIn: '24h'
                        })
                    });
                }
            }
        })
});

router.get("/current_user", validateToken, async (req, res) => {
    res.json(req.user)
});


module.exports = router;