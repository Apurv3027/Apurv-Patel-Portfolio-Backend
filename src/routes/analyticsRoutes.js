const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/track", controller.track);

// Protect all other analytics endpoints
router.use(authMiddleware);

router.get("/total", controller.totalVisitors);
router.get("/by-date", controller.visitorsByDate);
router.get("/by-country", controller.visitorsByCountry);
router.get("/device-stats", controller.deviceStats);
router.get("/platform-stats", controller.platformStats);
router.get("/recent", controller.recentVisitors);
router.get("/visitors", controller.getVisitors);
router.get("/active-users", controller.getActiveUsers);
router.get("/realtime", controller.getRealtimeData);


module.exports = router;