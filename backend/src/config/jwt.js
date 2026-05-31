const jwt = require('jsonwebtoken');
const env = require('./env');

const jwtConfig = {
    SECRET: env.jwtSecret,
    REFRESH_SECRET: env.jwtRefreshSecret,
    EXPIRES_IN: env.jwtExpiresIn,
    REFRESH_TOKEN_EXPIRES_IN: env.jwtRefreshExpiresIn
};

function generateAccessToken(user) {
    return jwt.sign(
        {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_role: user.user_role
        },
        jwtConfig.SECRET,
        {
            expiresIn: jwtConfig.EXPIRES_IN
        }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { user_id: user.user_id },
        jwtConfig.SECRET,
        {
            expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRES_IN
        }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, jwtConfig.SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    jwtConfig
};