//Express 
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
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))
app.use(cors());
app.use('/', express.static('public'))


const AuthRouter = require("./routes/auth.router")
const WorkerRouter = require("./routes/worker.router")
const InternetRouter = require("./routes/internet.router")
const NewsRouter = require("./routes/news.router")
const ServiceRouter = require("./routes/service.router")
const RegionRouter = require("./routes/region.router")
const AddressRouter = require("./routes/address.router")
const TarifRouter = require("./routes/tarif.router")
const CategoryRouter = require("./routes/category.router")


app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/worker", WorkerRouter);
app.use("/api/v1/internet", InternetRouter);
app.use("/api/v1/news", NewsRouter);
app.use("/api/v1/service", ServiceRouter);
app.use("/api/v1/region", RegionRouter);
app.use("/api/v1/address", AddressRouter);
app.use("/api/v1/tarif", TarifRouter);
app.use("/api/v1/category", CategoryRouter);



//serv
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})