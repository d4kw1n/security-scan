const { sign } = require("jsonwebtoken");

const TokenController = {
    generateAccessToken: (user) => {
        if (!user) {
            throw new Error("Người dùng không hợp lệ");
        }
        const accessToken = sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.KEY_ACCESS_TOKEN_JWT,
            { expiresIn: "30d" }
        );
        return accessToken;
    },

    generateRefreshToken: (user) => {
        if (!user) {
            throw new Error("Người dùng không hợp lệ");
        }
        const refreshToken = sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.KEY_REFRESH_TOKEN_JWT,
            { expiresIn: "30d" }
        );
        return refreshToken;
    },
};

module.exports = TokenController;
