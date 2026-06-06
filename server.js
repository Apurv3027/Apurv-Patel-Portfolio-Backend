require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const app = require("./src/app");
const socketSetup = require("./src/sockets/socket");
const { setIO } = require("./src/sockets/io");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: env.corsOrigins,
    },
});

setIO(io);
socketSetup(io);

server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
});