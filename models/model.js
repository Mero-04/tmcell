const { DataTypes } = require('sequelize');
const sequelize = require("../data/db");

const Admin = sequelize.define("admin", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "User", allowNull: false },
});

const Worker = sequelize.define("worker", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phoneNum: { type: DataTypes.STRING, allowNull: true },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Roles = sequelize.define("roles", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: { type: DataTypes.STRING, allowNull: false }
});

const News = sequelize.define("news", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    news_img: { type: DataTypes.STRING, allowNull: false },
});

const Internet = sequelize.define("internet", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    volume: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    connectUSSD: { type: DataTypes.STRING, allowNull: false },
    internet_img: { type: DataTypes.STRING, allowNull: false },
});


Admin.findOrCreate({ where: { email: "admin@gmail.com", password: "$2b$10$.2s8SLEln9Dnql5sPuvtfec93qtcKyvMAqDY8zeLg8IcndoHNtXWS", role: "Admin" } })

Roles.hasMany(Worker)
Worker.belongsTo(Roles)

Worker.hasMany(Internet)
Internet.belongsTo(Worker)

Worker.hasMany(News)
News.belongsTo(Worker)

module.exports = {
    Admin,
    Worker,
    Roles,
    Internet,
    News
};
