const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    ip: String,
    city: String,
    country: String,
    countryCode: String,
    device: String,
    browser: String,
    os: String,
    visitedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Visitor", visitorSchema);