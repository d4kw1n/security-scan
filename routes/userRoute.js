const route = require("express").Router();
const UserCTL= require("../Controller/UserCTL");
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
route.get("/getInfo/:id", UserCTL.getInfo);
route.post("/password/change", UserCTL.changePassword);
route.post("/name/change", UserCTL.editName);
route.post("/avatar/change", upload.single("avatar"), UserCTL.editAvatar);

module.exports = route;