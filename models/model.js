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
    name_tm: {
        type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu kategoriýa önem bar!" }, validate: {
            notEmpty: { msg: "Kategoriýanyň adyny giriziň!" }
        }
    },
    name_en: {
        type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu kategoriýa önem bar!" }, validate: {
            notEmpty: { msg: "Kategoriýanyň adyny giriziň!" }
        }
    },
    name_ru: {
        type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu kategoriýa önem bar!" }, validate: {
            notEmpty: { msg: "Kategoriýanyň adyny giriziň!" }
        }
    },

});


const News = sequelize.define("news", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň adyny giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň adyny giriziň!" }
        }
    },
    title_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň adyny giriziň!" }
        }
    },
    description_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň mazmunyny giriziň!" }
        }
    },
    description_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň mazmunyny giriziň!" }
        }
    },
    description_ru: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň mazmunyny giriziň!" }
        }
    },
    news_img: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Täzeligiň suratyny giriziň!" }
        }
    },
    viewed: {
        type: DataTypes.INTEGER, allowNull: true, defaultValue: "0"
    },
    checked: {
        type: DataTypes.TINYINT, allowNull: false, defaultValue: "0"
    },
    created_at: {
        type: DataTypes.STRING, allowNull: false
    },
});

const Internet = sequelize.define("internet", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň görnüşini giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň görnüşini giriziň!" }
        }
    },
    title_ru: {
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
    short_desc_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň gysga mazmunyny giriziň!" }
        }
    },
    short_desc_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň gysga mazmunyny giriziň!" }
        }
    },
    short_desc_ru: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň gysga mazmunyny giriziň!" }
        }
    },
    description_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň mazmunyny giriziň!" }
        }
    },
    description_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Internet bukjanyň mazmunyny giriziň!" }
        }
    },
    description_ru: {
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
    viewed: {
        type: DataTypes.INTEGER, allowNull: true, defaultValue: "0"
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
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň adyny giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň adyny giriziň!" }
        }
    },
    title_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň adyny giriziň!" }
        }
    },
    short_desc_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň gysga mazmunyny giriziň!" }
        }
    },
    short_desc_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň gysga mazmunyny giriziň!" }
        }
    },
    short_desc_ru: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň gysga mazmunyny giriziň!" }
        }
    },
    description_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň mazmunyny giriziň!" }
        }
    },
    description_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň mazmunyny giriziň!" }
        }
    },
    description_ru: {
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
    connect_USSD: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyn USSD kodyny giriziň!" }
        }
    },
    viewed: {
        type: DataTypes.INTEGER, allowNull: true, defaultValue: "0"
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
    name_tm: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu welaýat önem bar!" } },
    name_en: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu welaýat önem bar!" } },
    name_ru: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu welaýat önem bar!" } }
});

const Region = sequelize.define("region", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    name_tm: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu etrap önem bar!" } },
    name_ru: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu etrap önem bar!" } },
    name_en: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu etrap önem bar!" } },
});

const Address = sequelize.define("address", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Salgyny giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Salgyny giriziň!" }
        }
    },
    title_ru: {
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
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň adyny giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň adyny giriziň!" }
        }
    },
    title_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň adyny giriziň!" }
        }
    },
    description_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň mazmunyny giriziň!" }
        }
    },
    description_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň mazmunyny giriziň!" }
        }
    },
    description_ru: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň mazmunyny giriziň!" }
        }
    },
    short_desc_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň gysga mazmunyny giriziň!" }
        }
    },
    short_desc_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyň gysga mazmunyny giriziň!" }
        }
    },
    short_desc_ru: {
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
    connect_USSD: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Nyrhnamanyn USSD kodyny giriziň!" }
        }
    },
    viewed: {
        type: DataTypes.INTEGER, allowNull: true, defaultValue: "0"
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
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň adyny giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň adyny giriziň!" }
        }
    },
    title_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň adyny giriziň!" }
        }
    },
    short_desc_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň gysga mazmunyny giriziň!" }
        }
    },
    short_desc_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň gysga mazmunyny giriziň!" }
        }
    },
    short_desc_ru: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň gysga mazmunyny giriziň!" }
        }
    },
    description_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň mazmunyny giriziň!" }
        }
    },
    description_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň mazmunyny giriziň!" }
        }
    },
    description_ru: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň mazmunyny giriziň!" }
        }
    },
    price: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň bahasyny giriziň!" }
        }
    },
    korporatiw_icon: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Hyzmatyň suratyny giriziň!" }
        }
    },
    connect_USSD: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Korporatiw nyrhnamanyn USSD kodyny giriziň!" }
        }
    },
    viewed: {
        type: DataTypes.INTEGER, allowNull: true, defaultValue: "0"
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
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Title giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Title giriziň!" }
        }
    },
    title_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Title giriziň!" }
        }
    },
    link: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Url salgy giriziň!" }
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
            notEmpty: { msg: "Adyňyzy giriziň!", msg_ru: "Поле имени не может быть пустым!", msg_en: "Name field cannot be empty!" }
        }
    },
    email: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "E-poçtaňyzy giriziň!", msg_ru: "Поле электронной почты не может быть пустым!", msg_en: "Email field cannot be empty!" }
        }
    },
    subject: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Teswiriňiziň temasyny giriziň!", msg_ru: "Поле темы не может быть пустым!", msg_en: "Subject field cannot be empty!" }
        }
    },
    comment: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Teswiriňizi giriziň!", msg_ru: "Поле комментария не может быть пустым!", msg_en: "Comment field cannot be empty!" }
        }
    },
    phone_num: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Nomeriňizi giriziň!", msg_ru: "Поле для номера телефона не может быть пустым!", msg_en: "Phone number cannot be empty!" }
        }
    },

});

const Program = sequelize.define("program", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň adyny giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň adyny giriziň!" }
        }
    },
    title_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň adyny giriziň!" }
        }
    },
    description_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň mazmunyny giriziň!" }
        }
    },
    description_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Mobil goşundynyň mazmunyny giriziň!" }
        }
    },
    description_ru: {
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
    play_store_qr: {
        type: DataTypes.TEXT, allowNull: true
    },
    app_store_qr: {
        type: DataTypes.TEXT, allowNull: true
    },
    viewed: {
        type: DataTypes.INTEGER, allowNull: true, defaultValue: "0"
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
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyny giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyny giriziň!" }
        }
    },
    title_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyny giriziň!" }
        }
    },
    description_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Mazmunyny giriziň!" }
        }
    },
    description_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Mazmunyny giriziň!" }
        }
    },
    description_ru: {
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

const Faq = sequelize.define("faq", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    question_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Soragy giriziň!" }
        }
    },
    question_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Soragy giriziň!" }
        }
    },
    question_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Soragy giriziň!" }
        }
    },
    answer_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Soragyn jogabyny giriziň!" }
        }
    },
    answer_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Soragyn jogabyny giriziň!" }
        }
    },
    answer_ru: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Soragyn jogabyny giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});


const USSD = sequelize.define("ussd", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    title_tm: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyny giriziň!" }
        }
    },
    title_en: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyny giriziň!" }
        }
    },
    title_ru: {
        type: DataTypes.STRING, allowNull: false, validate: {
            notEmpty: { msg: "Adyny giriziň!" }
        }
    },
    code_tm: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Giriziň!" }
        }
    },
    code_en: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Giriziň!" }
        }
    },
    code_ru: {
        type: DataTypes.TEXT, allowNull: false, validate: {
            notEmpty: { msg: "Giriziň!" }
        }
    },
    checked: { type: DataTypes.TINYINT, allowNull: false, defaultValue: "0" }
});

const Email = sequelize.define("email", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: { args: true, msg: "Bu email bilen on yazylypsynyz!" } }
});

const Galery = sequelize.define("galery", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    galery_img: {
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
    Popup,
    Faq,
    USSD,
    Email,
    Galery
};
