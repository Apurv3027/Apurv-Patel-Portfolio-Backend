const jwt = require("jsonwebtoken");
const env = require("../config/env");
const activeVisitorStore = require("../services/activeVisitorStore");
const analyticsService = require("../services/analyticsService");

module.exports = (io) => {
    // Authenticate the handshake token
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication error: Token missing"));
        }
        try {
            const decoded = jwt.verify(token, env.jwtSecret);
            socket.admin = decoded;
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid or expired token"));
        }
    });

    io.on("connection", async (socket) => {
        try {
            const realtimeData = await analyticsService.getRealtimeData();
            socket.emit("visitorUpdate", {
                activeCount: realtimeData.activeCount,
                activeVisitors: realtimeData.activeVisitors,
                updatedAt: realtimeData.updatedAt,
            });
        } catch {
            socket.emit("visitorUpdate", {
                activeCount: activeVisitorStore.getCount(),
                activeVisitors: activeVisitorStore.getAll(),
                updatedAt: new Date(),
            });
        }

        socket.on("requestRealtimeData", async () => {
            try {
                const realtimeData = await analyticsService.getRealtimeData();
                socket.emit("realtimeData", realtimeData);
            } catch (err) {
                socket.emit("realtimeData", { error: err.message });
            }
        });

        socket.on("disconnect", () => {});
    });
};
