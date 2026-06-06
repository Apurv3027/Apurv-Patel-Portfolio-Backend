const Visitor = require("../models/Visitor");
const activeVisitorStore = require("./activeVisitorStore");

const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

exports.trackVisitor = async (data) => {
    const now = new Date();
    const { sessionId, page } = data;

    const lastVisit = await Visitor.findOne({
        sessionId,
        page,
        visitedAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    });

    if (lastVisit) {
        lastVisit.lastSeenAt = now;
        await lastVisit.save();

        const visitorPayload = {
            sessionId: lastVisit.sessionId,
            page: lastVisit.page,
            platform: lastVisit.platform,
            deviceType: lastVisit.deviceType,
            browser: lastVisit.browser,
            os: lastVisit.os,
            device: lastVisit.device,
            country: lastVisit.country,
            countryCode: lastVisit.countryCode,
            city: lastVisit.city,
            lastSeenAt: now,
        };

        activeVisitorStore.upsert(visitorPayload);

        return { duplicate: true, visitor: lastVisit, activeVisitors: activeVisitorStore.getAll() };
    }

    const visitor = await Visitor.create({
        ...data,
        visitedAt: now,
        lastSeenAt: now,
    });

    activeVisitorStore.upsert({
        sessionId: visitor.sessionId,
        page: visitor.page,
        platform: visitor.platform,
        deviceType: visitor.deviceType,
        browser: visitor.browser,
        os: visitor.os,
        device: visitor.device,
        country: visitor.country,
        countryCode: visitor.countryCode,
        city: visitor.city,
        lastSeenAt: now,
    });

    return { duplicate: false, visitor, activeVisitors: activeVisitorStore.getAll() };
};

exports.getTotalVisitors = async () => {
    return await Visitor.countDocuments();
};

exports.getVisitorsByDate = async () => {
    return await Visitor.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitedAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
};

exports.getVisitorsByCountry = async () => {
    return await Visitor.aggregate([
        {
            $group: {
                _id: "$countryCode",
                count: { $sum: 1 },
            },
        },
    ]);
};

exports.getDeviceStats = async () => {
    return await Visitor.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$deviceType", "desktop"] },
                count: { $sum: 1 },
            },
        },
    ]);
};

exports.getPlatformStats = async () => {
    return await Visitor.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$platform", "Unknown"] },
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);
};

exports.getRecentVisitors = async () => {
    return await Visitor.find()
        .sort({ visitedAt: -1 })
        .limit(10)
        .lean();
};

exports.getVisitors = async ({ page = 1, limit = 10, filter }) => {
    const query = {};

    if (filter === "today") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        query.visitedAt = { $gte: start };
    }

    if (filter === "7days") {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        query.visitedAt = { $gte: last7Days };
    }

    const visitors = await Visitor.find(query)
        .sort({ visitedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Visitor.countDocuments(query);

    return {
        total,
        page,
        pages: Math.ceil(total / limit),
        data: visitors,
    };
};

exports.getActiveUsers = async () => {
    const last5Min = new Date(Date.now() - activeVisitorStore.ACTIVE_WINDOW_MS);

    const visitors = await Visitor.aggregate([
        {
            $addFields: {
                effectiveLastSeen: { $ifNull: ["$lastSeenAt", "$visitedAt"] },
            },
        },
        { $match: { effectiveLastSeen: { $gte: last5Min } } },
        { $sort: { effectiveLastSeen: -1 } },
        {
            $group: {
                _id: "$sessionId",
                sessionId: { $first: "$sessionId" },
                page: { $first: "$page" },
                platform: { $first: "$platform" },
                deviceType: { $first: "$deviceType" },
                browser: { $first: "$browser" },
                os: { $first: "$os" },
                device: { $first: "$device" },
                country: { $first: "$country" },
                countryCode: { $first: "$countryCode" },
                city: { $first: "$city" },
                lastSeenAt: { $first: "$effectiveLastSeen" },
            },
        },
        { $sort: { lastSeenAt: -1 } },
    ]);

    return {
        count: visitors.length,
        visitors,
    };
};

exports.getRealtimeData = async () => {
    const [activeUsers, recentVisitors, platformStats, total] = await Promise.all([
        exports.getActiveUsers(),
        exports.getRecentVisitors(),
        exports.getPlatformStats(),
        exports.getTotalVisitors(),
    ]);

    return {
        totalVisitors: total,
        activeCount: activeUsers.count,
        activeVisitors: activeUsers.visitors,
        recentVisitors,
        platformStats,
        updatedAt: new Date(),
    };
};
