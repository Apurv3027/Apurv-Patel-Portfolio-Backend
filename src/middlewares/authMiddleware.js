const jwt = require("jsonwebtoken");
const env = require("../config/env");

module.exports = (req, res, next) => {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No authentication token provided.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Invalid or expired authentication token.",
        });
    }
};
