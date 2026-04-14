const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/portfolio_analytics");
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("DB Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;