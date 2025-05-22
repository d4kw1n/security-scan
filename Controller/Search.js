const Course = require("../Model/Course");
const Lesson = require("../Model/Lesson");
const User = require("../Model/User");

const Search = {
    searchCourse: async (req, res) => {
        try {
            const { key } = req.params;

            if (!key) {
                return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
            }

            const [courses, lessons, users] = await Promise.all([
                Course.find({
                    $or: [
                        { title: { $regex: '.*' + key + '.*', $options: 'i' } },
                        { desc: { $regex: '.*' + key + '.*', $options: 'i' } }
                    ]
                }),
                Lesson.find({
                    name: { $regex: '.*' + key + '.*', $options: 'i' }
                }).populate('courseID', 'img title'),
                User.find({
                    name: { $regex: '.*' + key + '.*', $options: 'i' }
                })
            ]);

            return res.status(200).json({ data: { courses, lessons, users } });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi" });
        }
    },
}

module.exports = Search;
