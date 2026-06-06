const UAParser = require("ua-parser-js");

const resolvePlatform = (osName, deviceType) => {
    if (!osName) {
        return deviceType === "mobile" ? "Mobile Web" : "Web";
    }

    const normalized = osName.toLowerCase();

    if (normalized.includes("ios")) return "iOS";
    if (normalized.includes("android")) return "Android";
    if (normalized.includes("windows")) return "Windows";
    if (normalized.includes("mac")) return "macOS";
    if (normalized.includes("linux")) return "Linux";

    return osName;
};

exports.parseUserAgent = (userAgent = "") => {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const deviceType = device.type || "desktop";
    const osName = os.name || null;
    const platform = resolvePlatform(osName, deviceType);

    return {
        browser: browser.name
            ? `${browser.name}${browser.version ? ` ${browser.major || browser.version}` : ""}`
            : "Unknown",
        os: osName ? `${osName}${os.version ? ` ${os.version}` : ""}` : "Unknown",
        device: device.model || device.vendor || deviceType,
        deviceType: deviceType === "mobile" || deviceType === "tablet" ? deviceType : "desktop",
        platform,
    };
};

const normalizeIp = (ip) => {
    if (!ip) return null;

    const value = String(ip).trim();

    if (value.startsWith("::ffff:")) {
        return value.slice(7);
    }

    return value;
};

exports.getClientIp = (req) => {
    const cfConnectingIp = req.headers["cf-connecting-ip"];
    const realIp = req.headers["x-real-ip"];
    const forwarded = req.headers["x-forwarded-for"];

    if (cfConnectingIp) {
        return normalizeIp(cfConnectingIp);
    }

    if (realIp) {
        return normalizeIp(realIp);
    }

    if (typeof forwarded === "string" && forwarded.length > 0) {
        return normalizeIp(forwarded.split(",")[0]);
    }

    return normalizeIp(req.ip || req.socket?.remoteAddress);
};
