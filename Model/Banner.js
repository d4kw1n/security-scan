const { Schema, model } = require("mongoose");

const BannerSchema = Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    urlImg: {
        type: String,
        required: true
    },
    extenalLink: {
        type: String,
    }
}, { timestamps: true });

module.exports = model("Banners", BannerSchema);