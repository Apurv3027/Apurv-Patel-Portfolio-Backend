const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const analyticsRoutes = require("./routes/analytics");
const setupSocket = require("./socket/socket");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/analytics", analyticsRoutes);

// Create server
const server = http.createServer(app);

// Socket Setup
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

setupSocket(io);

// Start Server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});