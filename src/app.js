const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const env = require("./config/env");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.set("trust proxy", true);

app.use(
    cors({
        origin: env.corsOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);


app.use(errorHandler);

module.exports = app;