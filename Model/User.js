const {Schema, model} = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    username: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "uploads/course/avatar-default.jpg"
    }
}, { timestamps: true });

module.exports = model("Users", UserSchema);