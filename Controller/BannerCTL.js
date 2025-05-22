const Banner = require('../Model/Banner');

const BannerCTL = {
    getPublic: async (req, res) => {
        try {
            const banners = await Banner.find({ status: true });
            return res.status(200).json({ data: banners });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    getAll: async (req, res) => {
        try {
            const banners = await Banner.find();
            return res.status(200).json({ data: banners });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    addBanner: async (req, res) => {
        try {
            const imageUrl = req.file.path.replace(/\\/g, '/');
            const { name, status, extenalLink } = req.body;
            if (!name || !imageUrl) {
                return res.status(400).json({ message: "Tiêu đề và ảnh không được để trống" });
            }
            await Banner.create({ name, status, urlImg: imageUrl, extenalLink });
            return res.status(200).json({ message: "Đã thêm banner" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Có lỗi" });
        }
    },

    detail: async (req, res) => {
        try {
            const banner = await Banner.findById(req.params.id);
            if (banner) {
                return res.status(200).json({ data: banner });
            }
            return res.status(404).json({ message: "Banner không tồn tại" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi" });
        }
    },

    edit: async (req, res) => {
        try {
            const { id, name, status, linkImg, extenalLink } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Tên và ảnh không được để trống" });
            }
            const imageUrl = req.file ? req.file.path.replace(/\\/g, '/') : linkImg;
            const updatedBanner = await Banner.findOneAndUpdate(
                { _id: id },
                { name, status, urlImg: imageUrl, extenalLink },
                { new: true }
            );
            if (updatedBanner) {
                return res.status(200).json({ message: "Thay đổi banner thành công" });
            }
            return res.status(404).json({ message: "Banner không tồn tại" });
        } catch (error) {
            return res.status(500).json({ message: "Có lỗi xảy ra" });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.body;
            const deletedBanner = await Banner.findByIdAndDelete(id);
            if (deletedBanner) {
                return res.status(200).json({ message: "Success" });
            }
            return res.status(404).json({ message: "Banner không tồn tại" });
        } catch (error) {
            return res.status(500).json({ message: "Có lỗi" });
        }
    }
}

module.exports = BannerCTL;
