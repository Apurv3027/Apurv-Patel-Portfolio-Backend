const service = require("../services/analyticsService");
const UAParser = require("ua-parser-js");

exports.track = async (req, res, next) => {
    try {
        const parser = new UAParser(req.body.device);
        const ua = parser.getResult();

        const visitorData = {
            ip: req.body.ip,
            city: req.body.city,
            country: req.body.country,
            countryCode: req.body.countryCode,
            device: ua.device.type || "desktop",
            browser: ua.browser.name,
            os: ua.os.name,
        };

        await service.trackVisitor(visitorData);

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