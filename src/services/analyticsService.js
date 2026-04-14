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