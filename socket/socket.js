let onlineUsers = 0;

const setupSocket = (io) => {
    io.on("connection", (socket) => {
        onlineUsers++;

        io.emit("onlineUsers", onlineUsers);

        socket.on("disconnect", () => {
            onlineUsers--;
            io.emit("onlineUsers", onlineUsers);
        });
    });
};

module.exports = setupSocket;