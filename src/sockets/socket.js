const activeVisitorStore = require("../services/activeVisitorStore");
const analyticsService = require("../services/analyticsService");

module.exports = (io) => {
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
