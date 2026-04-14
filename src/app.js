const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const analyticsRoutes = require("./routes/analyticsRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/analytics", analyticsRoutes);

app.use(errorHandler);

module.exports = app;