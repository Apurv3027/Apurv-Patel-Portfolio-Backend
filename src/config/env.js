const getCorsOrigins = () => {
    if (process.env.CORS_ORIGINS) {
        return process.env.CORS_ORIGINS.split(",")
            .map((origin) => origin.trim())
            .filter(Boolean);
    }

    return [process.env.LOCAL_CLIENT_URL, process.env.CLIENT_URL].filter(Boolean);
};

module.exports = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGO_URI,
    clientUrl: process.env.CLIENT_URL,
    localClientUrl: process.env.LOCAL_CLIENT_URL || "http://localhost:3000",
    corsOrigins: getCorsOrigins(),
    jwtSecret: process.env.JWT_SECRET || "fallback_portfolio_jwt_secret_12345",
    adminEmail: process.env.ADMIN_EMAIL || "admin@apurv.com",
    adminPassword: process.env.ADMIN_PASSWORD || "123456",
};

