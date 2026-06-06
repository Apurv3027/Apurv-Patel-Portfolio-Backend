const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

const activeVisitors = new Map();

const pruneStale = () => {
    const cutoff = Date.now() - ACTIVE_WINDOW_MS;

    for (const [sessionId, visitor] of activeVisitors.entries()) {
        if (new Date(visitor.lastSeenAt).getTime() < cutoff) {
            activeVisitors.delete(sessionId);
        }
    }
};

exports.upsert = (visitor) => {
    pruneStale();

    activeVisitors.set(visitor.sessionId, {
        sessionId: visitor.sessionId,
        page: visitor.page,
        ip: visitor.ip,
        platform: visitor.platform,
        deviceType: visitor.deviceType,
        browser: visitor.browser,
        os: visitor.os,
        device: visitor.device,
        country: visitor.country,
        countryCode: visitor.countryCode,
        city: visitor.city,
        lastSeenAt: visitor.lastSeenAt || new Date(),
    });
};

exports.getAll = () => {
    pruneStale();
    return Array.from(activeVisitors.values()).sort(
        (a, b) => new Date(b.lastSeenAt) - new Date(a.lastSeenAt)
    );
};

exports.getCount = () => {
    pruneStale();
    return activeVisitors.size;
};

exports.ACTIVE_WINDOW_MS = ACTIVE_WINDOW_MS;
