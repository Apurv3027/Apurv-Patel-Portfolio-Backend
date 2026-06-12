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
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, postman)
            if (!origin) return callback(null, true);

            // Check if origin matches allowed origins (with or without trailing slash)
            const cleanedOrigin = origin.replace(/\/$/, "");
            const isAllowed = env.corsOrigins.some(o => o.replace(/\/$/, "") === cleanedOrigin);

            if (isAllowed || env.nodeEnv === "development") {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);


app.use(errorHandler);

module.exports = app;