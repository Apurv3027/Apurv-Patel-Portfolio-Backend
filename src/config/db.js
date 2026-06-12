const mongoose = require("mongoose");
const env = require("./env");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            console.log("No admin users found. Seeding default admin user...");
            await Admin.create({
                email: env.adminEmail,
                password: env.adminPassword,
            });
            console.log(`Default admin user created: ${env.adminEmail}`);
        }
    } catch (error) {
        console.error("Seeding admin error:", error.message);
    }
};

const connectDB = async () => {
    try {
        if (!env.mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(env.mongoUri);
        console.log("MongoDB Connected");

        // Seed default admin
        await seedAdmin();
    } catch (error) {
        console.error("DB Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;