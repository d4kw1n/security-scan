const User = require("../Model/User");
const bcrypt = require("bcrypt");

const UserCTL = {
    getInfo: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ _id: id });
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }
            return res.status(200).json({ data: user });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPass, newPass, idUser } = req.body;
            if (!currentPass || !newPass || !idUser) {
                return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ" });
            }
            const user = await User.findOne({ _id: idUser });
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }
            const checkPassword = await bcrypt.compare(currentPass, user.password);
            if (!checkPassword) {
                return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
            }
            const hashedPass = await bcrypt.hash(newPass, 10);
            user.password = hashedPass;
            await user.save();
            return res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    editName: async (req, res) => {
        try {
            const { id, name } = req.body;
            if (!id || !name) {
                return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ" });
            }
            const user = await User.findOne({ _id: id });
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }
            user.name = name;
            await user.save();
            return res.status(200).json({ message: "Thay đổi tên thành công" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    editAvatar: async (req, res) => {
        try {
            const { id } = req.body;
            const imageUrl = req.file.path;
            const avatar = imageUrl.replace(/\\/g, '/');
            if (!id) {
                return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ" });
            }
            const user = await User.findOne({ _id: id });
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }
            user.avatar = avatar;
            await user.save();
            return res.status(200).json({ message: "Thay đổi ảnh đại diện thành công", avatar: avatar });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    }
};

module.exports = UserCTL;
