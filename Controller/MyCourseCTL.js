const MyCourses = require("../Model/MyCourse");

const MyCourseCTL = {
    getAll: async (req, res) => {
        try {
            const { idUser } = req.params;
            const courses = await MyCourses.find({ idUser }).populate('idCourse', 'title desc img');
            res.status(200).json({ data: courses });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi" });
        }
    },
    addCourse: async (req, res) => {
        try {
            const { idUser, idCourse } = req.body;
            if (!idUser || !idCourse) {
                return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
            }
            const existingCourse = await MyCourses.findOneAndUpdate(
                { idUser, idCourse },
                { $setOnInsert: { idUser, idCourse } },
                { upsert: true, new: true }
            );
            if (!existingCourse) {
                return res.status(200).json({ message: "Thành công" });
            }
            return res.status(400).json({ message: "Đã học" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi" });
        }
    }
}

module.exports = MyCourseCTL;
