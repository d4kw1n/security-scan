const { Schema, model } = require("mongoose");

const MyCourseSchema = Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    idCourse: {
        type: Schema.Types.ObjectId,
        ref: "Courses",
        required: true
    }
}, { timestamps: true });

module.exports = model("Mycourses", MyCourseSchema);