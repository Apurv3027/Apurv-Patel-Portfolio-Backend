const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
    try {
        if (!env.mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(env.mongoUri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("DB Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;