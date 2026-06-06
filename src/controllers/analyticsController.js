const service = require("../services/analyticsService");
const { parseUserAgent, getClientIp } = require("../utils/parseUserAgent");
const { getIO } = require("../sockets/io");

const emitRealtimeUpdate = (payload) => {
    const io = getIO();

    if (!io) return;

    io.emit("visitorUpdate", payload);
};

exports.track = async (req, res) => {
    try {
        const { sessionId, page, city, country, countryCode } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        const userAgent = req.headers["user-agent"] || "";
        const parsed = parseUserAgent(userAgent);

        const visitorData = {
            sessionId,
            page: page || "/",
            city: city || null,
            country: country || null,
            countryCode: countryCode || null,
            ip: getClientIp(req),
            browser: parsed.browser,
            os: parsed.os,
            device: parsed.device,
            deviceType: parsed.deviceType,
            platform: parsed.platform,
        };

        const result = await service.trackVisitor(visitorData);

        const realtimePayload = {
            activeCount: result.activeVisitors.length,
            activeVisitors: result.activeVisitors,
            latestVisitor: {
                sessionId: result.visitor.sessionId,
                page: result.visitor.page,
                ip: result.visitor.ip,
                platform: result.visitor.platform,
                deviceType: result.visitor.deviceType,
                browser: result.visitor.browser,
                os: result.visitor.os,
                country: result.visitor.country,
                city: result.visitor.city,
                lastSeenAt: result.visitor.lastSeenAt,
                duplicate: result.duplicate,
            },
            updatedAt: new Date(),
        };

        emitRealtimeUpdate(realtimePayload);

        res.json({
            success: true,
            duplicate: result.duplicate,
            ip: result.visitor.ip,
            platform: result.visitor.platform,
            realtime: realtimePayload,
        });
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

exports.platformStats = async (req, res, next) => {
    try {
        const data = await service.getPlatformStats();
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

exports.getRealtimeData = async (req, res, next) => {
    try {
        const data = await service.getRealtimeData();
        res.json(data);
    } catch (err) {
        next(err);
    }
};
