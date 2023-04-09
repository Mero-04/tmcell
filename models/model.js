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
    name: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyny giriziň!" }
        }
    },
    email: {
        type: DataTypes.STRING, allowNull: false,
        unique: { args: true, msg: "Bu e-poçta ulanylýar!" },
        validate: { isEmail: { msg: "Hökman e-poçta bolmaly!" } }
    },
    password: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Açar sözini giriziň!" }
        }
    },
    phone_num: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Telefon nomerini giriziň!" }
        }
    },
    role: {
        type: DataTypes.ENUM('Nyrhnama', 'Internet', 'Address', 'Tazelik', 'Hyzmat', 'Program'), allowNull: true, validate: {
            notEmpty: { msg: "Status saylan!" }
        }
    }
});

const Category = sequelize.define("category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu kategoriýa önem bar!" }, validate: {
            notEmpty: { msg: "Kategoriýanyň adyny giriziň!" }
        }
    }

});


const News = sequelize.define("news", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň adyny giriziň!" }
        }
    },
    description: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň mazmunyny giriziň!" }
        }
    },
    news_img: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň suratyny giriziň!" }
        }
    },
    checked: {
        type: DataTypes.TINYINT, allowNull: false, defaultValue: "0"
    }
});

const Internet = sequelize.define("internet", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň görnüşini giriziň!" }
        }
    },
    volume: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň mukdaryny giriziň!" }
        }
    },
    price: {
        type: DataTypes.INTEGER, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň bahasyny giriziň!" }
        }
    },
    short_desc: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň gysga mazmunyny giriziň!" }
        }
    },
    description: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň mazmunyny giriziň!" }
        }
    },
    connect_USSD: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň USSD kodyny giriziň!" }
        }
    },
    internet_icon: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Internet paketiň iconyny giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Service = sequelize.define("service", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň adyny giriziň!" }
        }
    },
    short_desc: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň gysga mazmunyny giriziň!" }
        }
    },
    description: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň mazmunyny giriziň!" }
        }
    },
    service_img: {
        type: DataTypes.STRING, allowNull: true, validate: {
            notEmpty: { msg: "Hyzmatyň suratyny giriziň!" }
        }
    },
    service_icon: {
        type: DataTypes.STRING, allowNull: true, validate: {
            notEmpty: { msg: "Hyzmatyň iconyny giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Welayat = sequelize.define("welayat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu welaýat önem bar!" }, }
});

const Region = sequelize.define("region", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu etrap önem bar!" }, }
});

const Address = sequelize.define("address", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Salgyny giriziň!" }
        }
    },
    phone_num: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Degişli operatoryň nomerini giriziň!" }
        }
    },
    open_time: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Iş wagtyny giriziň!" }
        }
    },
    close_time: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Iş wagtyny giriziň!" }
        }
    },
    latitude: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Koordinatasyny giriziň!" }
        }
    },
    longitude: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Koordinatasyny giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Tarif = sequelize.define("tarif", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň adyny giriziň!" }
        }
    },
    description: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň mazmunyny giriziň!" }
        }
    },
    short_desc: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň gysga mazmunyny giriziň!" }
        }
    },
    tarif_img: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň suratyny giriziň!" }
        }
    },
    price: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň bahasyny giriziň!" }
        }
    },
    period: {
        type: DataTypes.TINYINT, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň periodyny giriziň!" }
        }
    },
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
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň adyny giriziň!" }
        }
    },
    short_desc: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň gysga mazmunyny giriziň!" }
        }
    },
    description: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň mazmunyny giriziň!" }
        }
    },
    koporatiw_icon: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň suratyny giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Sponsor = sequelize.define("sponsor", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Title giriziň!" }
        }
    },
    sponsor_img: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Suraty giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Contact = sequelize.define("contact", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyňyzy giriziň!" }
        }
    },
    email: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "E-poçtaňyzy giriziň!" }
        }
    },
    subject: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Teswiriňiziň temasyny giriziň!" }
        }
    },
    comment: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Teswiriňizi giriziň!" }
        }
    }

});

const Program = sequelize.define("program", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň adyny giriziň!" }
        }
    },
    description: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň mazmunyny giriziň!" }
        }
    },
    program_img: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň suratyny giriziň!" }
        }
    },
    app_store: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň app_store linkini giriziň!" }
        }
    },
    play_store: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň play_store linkini giriziň!" }
        }
    },
    QR: {
        type: DataTypes.STRING, allowNull: true, validate: {
            notEmpty: { msg: "Mobil goşundynyň QR kodyny giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Banner = sequelize.define("banner", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    link: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Banneriň linkini giriziň!" }
        }
    },
    banner_img: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Surat giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Popup = sequelize.define("popup", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyny giriziň!" }
        }
    },
    description: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Mazmunyny giriziň!" }
        }
    },
    link: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Link giriziň!" }
        }
    },
    popup_img: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Surat giriziň!" }
        }
    },
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
    Sponsor,
    Popup
};
