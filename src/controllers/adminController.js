const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find admin in DB
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Verify password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            env.jwtSecret,
            { expiresIn: "7d" } // 7 days expiration
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (err) {
        next(err);
    }
};
