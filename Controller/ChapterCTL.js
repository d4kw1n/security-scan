const Chapter = require("../Model/Chapter");

const ChapterCTL = {
    getAll: async (req, res) => {
        try {
            const chapters = await Chapter.find().populate('courseID', 'title _id');
            return res.status(200).json({ data: chapters });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    getChapter: async (req, res) => {
        try {
            const { id } = req.params;
            const chapters = await Chapter.find({ courseID: id });
            return res.status(200).json({ data: chapters });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const chapter = await Chapter.findOne({ _id: id }).populate('courseID', 'title _id');
            return res.status(200).json({ data: chapter });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    edit: async (req, res) => {
        try {
            const { id, name, courseID, quanLesson } = req.body;
            const chapter = await Chapter.findOne({ _id: id });
            chapter.name = name;
            chapter.courseID = courseID;
            chapter.quanLesson = quanLesson;
            await chapter.save();
            return res.status(200).json({ message: "Thay đổi chapter thành công" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    getChapterByCourseId: async (req, res) => {
        try {
            const { id } = req.params;
            const chapters = await Chapter.find({ courseID: id });
            res.status(200).json({ data: chapters });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    addChapter: async (req, res) => {
        try {
            const { name, courseID, quanLesson } = req.body;
            await Chapter.create({ name, courseID, quanLesson });
            return res.status(200).json({ message: "Thêm thành công" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    increase: async (id) => {
        try {
            const chapter = await Chapter.findOne({ _id: id });
            if (chapter) {
                chapter.quanLesson++;
                await chapter.save();
            }
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try {
            await Chapter.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Xóa thành công" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    }
}

module.exports = ChapterCTL;
