const service = require("../services/contactService");
const { getClientIp } = require("../utils/parseUserAgent");

// ── Validation helpers ────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate the contact form request body.
 * Returns an object of field errors, or an empty object if valid.
 */
const validateBody = (body) => {
    const errors = {};
    const { name, email, subject, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
        errors.name = "Name is required.";
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        errors.email = "Must be a valid email address.";
    }

    if (!subject || typeof subject !== "string" || !subject.trim()) {
        errors.subject = "Subject is required.";
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
        errors.message = "Message must be at least 10 characters.";
    }

    return errors;
};

// ── Public controller ─────────────────────────────────────────────────────────

/**
 * POST /api/contact
 * Public endpoint — no auth required.
 */
exports.submitContact = async (req, res) => {
    try {
        const ip = getClientIp(req);

        // ── Rate limiting: max 3 submissions per IP in 15 minutes ──────────
        const recentCount = await service.countRecentByIp(ip, 15);
        if (recentCount >= 3) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please wait a moment before trying again.",
            });
        }

        // ── Validation ─────────────────────────────────────────────────────
        const errors = validateBody(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid request. Please check your input.",
                errors,
            });
        }

        const { name, email, phone, subject, message } = req.body;

        // ── Persist to database ────────────────────────────────────────────
        await service.saveContact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? String(phone).trim() : null,
            subject: subject.trim(),
            message: message.trim(),
            ip,
        });

        return res.status(201).json({
            success: true,
            message: "Your message has been received. We'll be in touch soon!",
        });
    } catch (err) {
        console.error("[ContactController] submitContact error:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

// ── Admin controllers ─────────────────────────────────────────────────────────

/**
 * GET /api/contact
 * Admin: list all messages (paginated, filterable by status).
 */
exports.getContacts = async (req, res, next) => {
    try {
        const { page, limit, status } = req.query;
        const data = await service.getContacts({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            status,
        });
        res.json({ success: true, ...data });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/contact/:id
 * Admin: get a single message by ID.
 */
exports.getContactById = async (req, res, next) => {
    try {
        const contact = await service.getContactById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found." });
        }
        res.json({ success: true, contact });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/contact/:id/status
 * Admin: update the read/replied/archived status of a message.
 */
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ["unread", "read", "replied", "archived"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(", ")}.`,
            });
        }

        const contact = await service.updateContactStatus(req.params.id, status);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found." });
        }
        res.json({ success: true, contact });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/contact/:id
 * Admin: permanently delete a message.
 */
exports.deleteContact = async (req, res, next) => {
    try {
        const contact = await service.deleteContact(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found." });
        }
        res.json({ success: true, message: "Contact message deleted." });
    } catch (err) {
        next(err);
    }
};
