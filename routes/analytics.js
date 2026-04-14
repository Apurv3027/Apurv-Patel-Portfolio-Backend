const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");


// Track Visitor
router.post("/track", async (req, res) => {
    try {
        const visitor = new Visitor(req.body);
        await visitor.save();
        res.json({ success: true, message: "Visitor tracked" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Total Visitors
router.get("/total-visitors", async (req, res) => {
    try {
        const total = await Visitor.countDocuments();
        res.json({ total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Visitors Per Day
router.get("/visitors-by-date", async (req, res) => {
    try {
        const data = await Visitor.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$visitedAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Visitors by Country
router.get("/visitors-by-country", async (req, res) => {
    try {
        const data = await Visitor.aggregate([
            {
                $group: {
                    _id: "$countryCode",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Device Stats
router.get("/device-stats", async (req, res) => {
    try {
        const data = await Visitor.aggregate([
            {
                $group: {
                    _id: "$device",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Recent Visitors (Optional)
router.get("/recent", async (req, res) => {
    try {
        const visitors = await Visitor.find()
            .sort({ visitedAt: -1 })
            .limit(10);

        res.json(visitors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;