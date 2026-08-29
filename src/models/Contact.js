const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            default: null,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        // Track origin IP for rate limiting reference
        ip: {
            type: String,
            default: null,
        },
        // Status for admin to manage inquiries
        status: {
            type: String,
            enum: ["unread", "read", "replied", "archived"],
            default: "unread",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Contact", contactSchema);
