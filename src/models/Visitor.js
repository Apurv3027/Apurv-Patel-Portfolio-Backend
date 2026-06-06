const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    ip: String,
    city: String,
    country: String,
    countryCode: String,
    device: String,
    deviceType: String,
    browser: String,
    os: String,
    platform: String,
    page: String,
    sessionId: String,
    visitedAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Visitor", visitorSchema);
