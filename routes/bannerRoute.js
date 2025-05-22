const route = require("express").Router();
const BannerCTL = require('./../Controller/BannerCTL');
// const { storage } = './../Middleware/storage.js';
const multer = require('multer');

const path = require("path");



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/banner"); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

route.get("/banner/public", BannerCTL.getPublic);
route.get("/banner/all", BannerCTL.getAll);
route.post("/banner/edit", upload.single("image"), BannerCTL.edit);
route.post("/banner/add", upload.single("image"), BannerCTL.addBanner);
route.get("/banner/detail/:id", BannerCTL.detail);
route.delete("/banner/delete/:id", BannerCTL.delete);

module.exports = route;