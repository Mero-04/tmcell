const { verify } = require("jsonwebtoken")

const isAdmin = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "Login etmediniz?" });
  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken
    if (validToken) {
      if (req.user.role !== "Admin") {
        return res.status(403).json({ error: "Sizin hich hili hukugynyz yok!!" });
      }
      return next();
    }

  } catch (err) {
    return res.json({ error: err });
  }
};

const isTariff = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "Login etmediniz?" });
  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    console.log(req.user)
    if (validToken) {
      if (req.user.role !== "Nyrhnama") {
        return res.status(403).json({ error: "Sizin hic hili hukugynyz yok!!" });
      }
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

const isNews = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "Login etmediniz?" });
  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    if (validToken) {
      if (req.user.role !== "Tazelik") {
        return res.status(403).json({ error: "Sizin hic hili hukugynyz yok!!" });
      }
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

const isInternet = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "Login etmediniz?" });
  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    if (validToken) {
      if (req.user.role !== "Internet") {
        return res.status(403).json({ error: "Sizin hic hili hukugynyz yok!!" });
      }
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

const isService = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "Login etmediniz?" });
  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    if (validToken) {
      if (req.user.role !== "Hyzmat") {
        return res.status(403).json({ error: "Sizin hic hili hukugynyz yok!!" });
      }
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

const isAddress = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "Login etmediniz?" });
  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    if (validToken) {
      if (req.user.role !== "Address") {
        return res.status(403).json({ error: "Sizin hic hili hukugynyz yok!!" });
      }
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};


module.exports = { isAdmin, isTariff, isNews, isInternet, isService, isAddress };