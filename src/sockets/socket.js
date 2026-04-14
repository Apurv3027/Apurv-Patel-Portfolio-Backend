let users = 0;

module.exports = (io) => {
    io.on("connection", (socket) => {
        users++;
        io.emit("onlineUsers", users);

        socket.on("disconnect", () => {
            users--;
            io.emit("onlineUsers", users);
        });
    });
};