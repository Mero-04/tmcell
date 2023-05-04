const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

const cors = require("cors");
const sequelize = require('./data/db');
// const apilimiter = require("./middlewares/rateLimit");
// app.use("/api", apilimiter)

app.use(express.json());
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(cors());
app.use('/', express.static('public'))

const HomeRouter = require("./routes/home.router")
const AuthRouter = require("./routes/auth.router")
const WorkerRouter = require("./routes/worker.router")
const InternetRouter = require("./routes/internet.router")
const NewsRouter = require("./routes/news.router")
const ServiceRouter = require("./routes/service.router")
const WelayatRouter = require("./routes/welayat.router")
const RegionRouter = require("./routes/region.router")
const AddressRouter = require("./routes/address.router")
const TarifRouter = require("./routes/tarif.router")
const CategoryRouter = require("./routes/category.router")
const ContactRouter = require("./routes/contact.router")
const KorporatiwRouter = require("./routes/korporatiw.router")
const ProgramRouter = require("./routes/program.router")
const BannerRouter = require("./routes/banner.router")
const SponsorRouter = require("./routes/sponsor.router")
const PopupRouter = require("./routes/popup.router")
const FaqRouter = require("./routes/faq.router")
const USSDRouter = require("./routes/ussd.router")
const EmailRouter = require("./routes/email.router")


app.use("/api/v1/home", HomeRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/worker", WorkerRouter);
app.use("/api/v1/internet", InternetRouter);
app.use("/api/v1/news", NewsRouter);
app.use("/api/v1/service", ServiceRouter);
app.use("/api/v1/welayat", WelayatRouter);
app.use("/api/v1/region", RegionRouter);
app.use("/api/v1/address", AddressRouter);
app.use("/api/v1/tarif", TarifRouter);
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/contact", ContactRouter);
app.use("/api/v1/korporatiw", KorporatiwRouter);
app.use("/api/v1/program", ProgramRouter);
app.use("/api/v1/banner", BannerRouter);
app.use("/api/v1/sponsor", SponsorRouter);
app.use("/api/v1/popup", PopupRouter);
app.use("/api/v1/faq", FaqRouter);
app.use("/api/v1/ussd", USSDRouter);
app.use("/api/v1/email", EmailRouter);


app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})