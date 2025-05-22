const { Schema, model } = require("mongoose");

const SubjectSchema = Schema({
    name: {
        type: String,
        required: true
    },
    quanCourse: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = model("Subjects", SubjectSchema);