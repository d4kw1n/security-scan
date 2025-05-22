const { Schema, model } = require("mongoose");

const LessonSchema = Schema({
    name: {
        type: String,
        required: true
    },
    chapterID: {
        type: Schema.Types.ObjectID,
        ref: "Chapters",
        required: true
    },
    urlVideo: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    courseID: {
        type: Schema.Types.ObjectId,
        ref: "Courses",
        required: true
    }
}, { timestamps: true });

module.exports = model("Lessons", LessonSchema);