const Subject = require("../Model/Subject");

const SubjectCTL = {
    getAll: async (req, res) => {
        try {
            const subjects = await Subject.find();
            res.status(200).json({ data: subjects });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi khi lấy dữ liệu chủ đề" });
        }
    },

    add: async (req, res) => {
        try {
            const { name } = req.body;

            // Kiểm tra tính hợp lệ của dữ liệu đầu vào
            if (!name) {
                return res.status(400).json({ message: "Tên chủ đề không được để trống" });
            }

            await Subject({ name }).save();
            res.status(200).json({ message: "Thêm chủ đề thành công" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi khi thêm chủ đề" });
        }
    },

    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const subject = await Subject.findOne({ _id: id });
            if (!subject) {
                return res.status(404).json({ message: "Không tìm thấy chủ đề" });
            }
            res.status(200).json({ data: subject });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi khi lấy chi tiết chủ đề" });
        }
    },

    edit: async (req, res) => {
        try {
            const { id, name } = req.body;

            // Kiểm tra tính hợp lệ của dữ liệu đầu vào
            if (!name) {
                return res.status(400).json({ message: "Tên chủ đề không được để trống" });
            }

            const subject = await Subject.findOne({ _id: id });
            if (!subject) {
                return res.status(404).json({ message: "Không tìm thấy chủ đề" });
            }

            subject.name = name;
            await subject.save();
            res.status(200).json({ message: "Chỉnh sửa chủ đề thành công" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi khi chỉnh sửa chủ đề" });
        }
    },

    increaseQuan: async (id) => {
        try {
            const subject = await Subject.findById(id);
            if (!subject) {
                console.log("Không tìm thấy chủ đề");
                return;
            }
            subject.quanCourse++;
            await subject.save();
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const subject = await Subject.findByIdAndDelete(id);
            if (!subject) {
                return res.status(404).json({ message: "Không tìm thấy chủ đề" });
            }
            res.status(200).json({ message: "Xóa chủ đề thành công" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi khi xóa chủ đề" });
        }
    }
}

module.exports = SubjectCTL;
