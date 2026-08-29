const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");
const authMiddleware = require("../middlewares/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
// POST /api/contact — submit a contact form message (no auth required)
router.post("/", controller.submitContact);

// ── Admin (protected) ─────────────────────────────────────────────────────────
router.use(authMiddleware);

// GET    /api/contact          — list all messages (paginated)
router.get("/", controller.getContacts);

// GET    /api/contact/:id      — get a single message
router.get("/:id", controller.getContactById);

// PATCH  /api/contact/:id/status — update read/replied/archived status
router.patch("/:id/status", controller.updateStatus);

// DELETE /api/contact/:id      — permanently delete a message
router.delete("/:id", controller.deleteContact);

module.exports = router;
