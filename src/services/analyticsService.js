const Visitor = require("../models/Visitor");

exports.trackVisitor = async (data) => {
    return await Visitor.create(data);
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
            $project: {
                deviceType: {
                    $cond: [
                        { $regexMatch: { input: "$device", regex: /mobile/i } },
                        "Mobile",
                        "Desktop",
                    ],
                },
            },
        },
        {
            $group: {
                _id: "$deviceType",
                count: { $sum: 1 },
            },
        },
    ]);
};

exports.getRecentVisitors = async () => {
    return await Visitor.find()
        .sort({ visitedAt: -1 })
        .limit(10);
};

exports.getVisitors = async ({ page = 1, limit = 10, filter }) => {
    const query = {};

    // 📅 Filter logic
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
    const last5Min = new Date(Date.now() - 5 * 60 * 1000);

    return await Visitor.countDocuments({
        visitedAt: { $gte: last5Min },
    });
};