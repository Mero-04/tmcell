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
    role: { type: DataTypes.ENUM('Nyrhnama', 'Internet', 'Address', 'Tazelik', 'Hyzmat','Program'), allowNull: true }
});

const Category = sequelize.define("category", {
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
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
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
    internet_icon: { type: DataTypes.STRING, allowNull: false },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
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
    service_icon: { type: DataTypes.STRING, allowNull: false },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Welayat = sequelize.define("welayat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: { type: DataTypes.STRING, allowNull: false }
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
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
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
    price: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "1" },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
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
    koporatiw_icon: { type: DataTypes.STRING, allowNull: false },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Sponsor = sequelize.define("sponsor", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    sponsor_img: { type: DataTypes.STRING, allowNull: false },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Contact = sequelize.define("contact", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    comment: { type: DataTypes.STRING, allowNull: false }

});

const Program = sequelize.define("program", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    program_img: { type: DataTypes.STRING, allowNull: false },
    app_store: { type: DataTypes.STRING, allowNull: false },
    play_store: { type: DataTypes.STRING, allowNull: false },
    QR: { type: DataTypes.STRING, allowNull: true },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Banner = sequelize.define("banner", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    link: { type: DataTypes.STRING, allowNull: false },
    banner_img: { type: DataTypes.STRING, allowNull: false },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

Admin.findOrCreate({ where: { email: "admin@gmail.com", password: "$2b$10$.2s8SLEln9Dnql5sPuvtfec93qtcKyvMAqDY8zeLg8IcndoHNtXWS", role: "Admin" } })

Worker.hasMany(Internet, { onDelete: "cascade", onUpdate: "cascade" })
Internet.belongsTo(Worker)

Worker.hasMany(News, { onDelete: "cascade", onUpdate: "cascade" })
News.belongsTo(Worker)

Category.hasMany(News, { onDelete: "cascade", onUpdate: "cascade" })
News.belongsTo(Category)

Welayat.hasMany(Region, { onDelete: "cascade", onUpdate: "cascade" })
Region.belongsTo(Welayat)

Region.hasMany(Address, { onDelete: "cascade", onUpdate: "cascade" })
Address.belongsTo(Region)

Worker.hasMany(Tarif, { onDelete: "cascade", onUpdate: "cascade" })
Tarif.belongsTo(Worker)

Worker.hasMany(Korporatiw, { onDelete: "cascade", onUpdate: "cascade" })
Korporatiw.belongsTo(Worker)

Worker.hasMany(Service, { onDelete: "cascade", onUpdate: "cascade" })
Service.belongsTo(Worker)

Worker.hasMany(Address, { onDelete: "cascade", onUpdate: "cascade" })
Address.belongsTo(Worker)

module.exports = {
    Admin,
    Worker,
    Internet,
    Category,
    News,
    Service,
    Welayat,
    Region,
    Address,
    Tarif,
    Korporatiw,
    Contact,
    Program,
    Banner,
    Sponsor
};
