const service = require("../services/analyticsService");

exports.track = async (req, res, next) => {
    try {
        await service.trackVisitor(req.body);
        res.json({ success: true });
    } catch (err) {
        next(err);
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