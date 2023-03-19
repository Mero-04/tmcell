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

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/worker", WorkerRouter);



//serv
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})