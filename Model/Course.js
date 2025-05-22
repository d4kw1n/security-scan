const { Schema, model } = require("mongoose");

const CourseSchema = Schema({
    subjectID: {
        type: Schema.Types.ObjectId,
        ref: "Subjects",
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
        default: "0"
    },
    lecture: {
        type: String,
        required: true,
        default: "Admin"
    },
    students: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = model("Courses", CourseSchema);