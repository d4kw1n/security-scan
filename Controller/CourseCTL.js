const Course = require("../Model/Course");
const { increaseQuan } = require("./SubjectCTL");

const CourseCTL = {
    getBySubjectID: async (req, res) => {
        try {
            const { id } = req.params;
            const courses = await Course.find({ subjectID: id });
            res.status(200).json({ data: courses });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },
    getAll: async (req, res) => {
        try {
            const courses = await Course.find();
            res.status(200).json({ data: courses });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    getPublic: async (req, res) => {
        try {
            const { id } = req.params;
            const courses = await Course.find({ status: true, subjectID: id });
            res.status(200).json({ data: courses });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    add: async (req, res) => {
        try {
            const { subjectID, title, desc, price, lecture, status } = req.body;
            const imageUrl = req.file.path.replace(/\\/g, '/');
            const newCourse = new Course({ subjectID, title, desc, price, lecture, status, img: imageUrl });
            await newCourse.save();
            await increaseQuan(subjectID);
            res.status(200).json({ message: "Thêm thành công" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const course = await Course.findById(id);
            res.status(200).json({ data: course });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    edit: async (req, res) => {
        try {
            const { id, subjectID, title, desc, price, lecture, status, linkImg } = req.body;
            const course = await Course.findById(id);
            course.subjectID = subjectID;
            course.title = title;
            course.desc = desc;
            course.price = price;
            course.lecture = lecture;
            course.status = status;
            if (linkImg !== course.img) {
                const imageUrl = req.file.path.replace(/\\/g, '/');
                course.img = imageUrl;
            }
            await course.save();
            res.status(200).json({ message: "Success" });
        } catch (error) {
            res.status(500).json({ message: "Error" });
        }
    },

    increaseStudent: async (req, res) => {
        try {
            const { id } = req.params;
            const course = await Course.findById(id);
            course.students++;
            await course.save();
            res.status(200).json({ message: "Thành công" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    delete: async (req, res) => {
        try {
            await Course.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Success" });
        } catch (error) {
            res.status(500).json({ message: "Error" });
        }
    }
};

module.exports = CourseCTL;
