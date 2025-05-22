const { Schema, model } = require("mongoose");

const ChapterSchema = Schema({
    name: {
        type: String,
        required: true
    },
    courseID: {
        type: Schema.Types.ObjectID,
        ref: "Courses",
        required: true
    },
    quanLesson: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = model("Chapters", ChapterSchema);