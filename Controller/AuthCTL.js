const User = require("../Model/User.js");
const bcrypt = require("bcrypt");
const TokenCTL = require("./TokenCTL");

const AuthController = {
    register: async (req, res) => {
        try {
            const { username, password, email, name } = req.body;
            const checkUsername = await User.findOne({ username });
            const checkEmail = await User.findOne({ email });
            if (checkEmail) {
                return res.status(409).json({ message: "Email đã tồn tại" });
            }
            if (checkUsername) {
                return res.status(409).json({ message: "Tên đăng nhập đã tồn tại" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPasswd = await bcrypt.hash(password, salt);
            await User.create({ name, username, email, password: hashPasswd });
            return res.status(200).json({ message: "Đăng ký thành công" });
        } catch (error) {
            return res.status(403).json({ message: "Có lỗi" });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu sai" });
            }
            const accessToken = TokenCTL.generateAccessToken(user);
            const refreshToken = TokenCTL.generateRefreshToken(user);
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, path: "/", sameSite: "strict" });
            res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, path: "/", sameSite: "strict" });
            const { password: _, ...userInfo } = user._doc;
            return res.status(200).json({ message: "Đăng nhập thành công", userInfo, accessToken, refreshToken });
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: "Có lỗi" });
        }
    },

    logout: async (req, res) => {
        try {
            res.removeHeader("token");
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json({ message: "Đăng xuất thành công" });
        } catch (err) {
            res.status(500).json({ message: "Có lỗi" });
        }
    }
}

module.exports = AuthController;
