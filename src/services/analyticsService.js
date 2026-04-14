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