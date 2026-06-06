const service = require("../services/analyticsService");
const UAParser = require("ua-parser-js");

exports.track = async (req, res) => {
    try {
        const { sessionId, page } = req.body;

        const lastVisit = await Visitor.findOne({
            sessionId,
            page,
            visitedAt: {
                $gte: new Date(Date.now() - 5 * 60 * 1000), // 5 min window
            },
        });

        // ❌ Duplicate → skip
        if (lastVisit) {
            return res.json({ success: true, duplicate: true });
        }

        await Visitor.create(req.body);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.totalVisitors = async (req, res, next) => {
    try {
        const total = await service.getTotalVisitors();
        res.json({ total });
    } catch (err) {
        next(err);
    }
};

exports.visitorsByDate = async (req, res, next) => {
    try {
        const data = await service.getVisitorsByDate();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.visitorsByCountry = async (req, res, next) => {
    try {
        const data = await service.getVisitorsByCountry();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.deviceStats = async (req, res, next) => {
    try {
        const data = await service.getDeviceStats();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.recentVisitors = async (req, res, next) => {
    try {
        const data = await service.getRecentVisitors();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getVisitors = async (req, res, next) => {
    try {
        const { page, limit, filter } = req.query;

        const data = await service.getVisitors({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            filter,
        });

        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getActiveUsers = async (req, res, next) => {
    try {
        const data = await service.getActiveUsers();
        res.json(data);
    } catch (err) {
        next(err);
    }
};