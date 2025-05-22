const Lesson = require("../Model/Lesson");
const { increase } = require("./ChapterCTL");

const LessonCTL = {
    getAll: async (req, res) => {
        try {
            const lessons = await Lesson.find().populate('chapterID courseID', '_id title name');
            res.status(200).json({ data: lessons });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },
    addLesson: async (req, res) => {
        try {
            const { courseID, name, chapterID, urlVideo, time } = req.body;
            await Lesson({
                courseID, name, chapterID, urlVideo, time
            }).save();
            await increase(chapterID);
            res.status(200).json({ message: "Thêm thành công" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    getAllByChapter: async (req, res) => {
        try {
            const { id } = req.params;
            const lessons = await Lesson.find({ chapterID: id });
            res.status(200).json({ data: lessons });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const lesson = await Lesson.findOne({ _id: id }).populate('courseID', 'title subjectID _id');
            return res.status(200).json({ data: lesson });
        } catch (error) {
            res.status(500).json({ message: "Error" });
        }
    },

    edit: async (req, res) => {
        try {
            const { id, courseID, name, chapterID, urlVideo, time } = req.body;
            const lesson = await Lesson.findOne({ _id: id });
            lesson.courseID = courseID;
            lesson.name = name;
            lesson.chapterID = chapterID;
            lesson.urlVideo = urlVideo;
            lesson.time = time;
            await lesson.save();
            res.status(200).json({ message: "Success" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error" });
        }
    },

    delete: async (req, res) => {
        try {
            await Lesson.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Success" });
        } catch (error) {
            res.status(500).json({ message: "Error" });
        }
    }
}

module.exports = LessonCTL;