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
    phone_num: { type: DataTypes.STRING, allowNull: false },
    role: {type: DataTypes.ENUM('Nyrhnama', 'Internet', 'Address','Tazelik','Hyzmat'), allowNull: true},
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
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
    description: { type: DataTypes.TEXT, allowNull: false },
    connect_USSD: { type: DataTypes.STRING, allowNull: false },
    internet_img: { type: DataTypes.STRING, allowNull: false },
});

const Service = sequelize.define("service", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    service_img: { type: DataTypes.STRING, allowNull: false },
});

const Region = sequelize.define("region", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: { type: DataTypes.STRING, allowNull: false }
    
});

const Address = sequelize.define("address", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    phone_num: { type: DataTypes.STRING, allowNull: false },
    open_time: { type: DataTypes.STRING, allowNull: false },    
    close_time: { type: DataTypes.STRING, allowNull: false },    
});

const Tarif = sequelize.define("tarif", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    tarif_img: { type: DataTypes.STRING, allowNull: false },
});

const Korporatiw = sequelize.define("korporatiw", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    korporatiw_img: { type: DataTypes.STRING, allowNull: false },
});

Admin.findOrCreate({ where: { email: "admin@gmail.com", password: "$2b$10$.2s8SLEln9Dnql5sPuvtfec93qtcKyvMAqDY8zeLg8IcndoHNtXWS", role: "Admin" } })

Worker.hasMany(Internet)
Internet.belongsTo(Worker)

Worker.hasMany(News)
News.belongsTo(Worker)

Region.hasMany(Address)
Address.belongsTo(Region)

Worker.hasMany(Tarif)
Tarif.belongsTo(Worker)

Worker.hasMany(Korporatiw)
Korporatiw.belongsTo(Worker)

Worker.hasMany(Service)
Service.belongsTo(Worker)

Worker.hasMany(Address)
Address.belongsTo(Worker)

module.exports = {
    Admin,
    Worker,
    Internet,
    News,
    Service,
    Region,
    Address,
    Tarif,
    Korporatiw
};
