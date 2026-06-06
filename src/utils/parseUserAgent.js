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

exports.getClientIp = (req) => {
    const forwarded = req.headers["x-forwarded-for"];

    if (typeof forwarded === "string" && forwarded.length > 0) {
        return forwarded.split(",")[0].trim();
    }

    return req.ip || req.socket?.remoteAddress || null;
};
