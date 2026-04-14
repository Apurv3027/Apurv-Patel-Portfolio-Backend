const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");

router.post("/track", controller.track);
router.get("/total", controller.totalVisitors);
router.get("/by-date", controller.visitorsByDate);
router.get("/by-country", controller.visitorsByCountry);
router.get("/device-stats", controller.deviceStats);
router.get("/recent", controller.recentVisitors);

module.exports = router;