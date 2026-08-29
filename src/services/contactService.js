const Contact = require("../models/Contact");

/**
 * Save a new contact message to the database.
 * @param {Object} data - Validated contact form data + ip
 * @returns {Promise<Contact>} - The saved document
 */
exports.saveContact = async (data) => {
    const contact = new Contact(data);
    return await contact.save();
};

/**
 * Get all contact messages (admin use).
 * @param {Object} options - { page, limit, status }
 * @returns {Promise<Object>} - { contacts, total, page, pages }
 */
exports.getContacts = async ({ page = 1, limit = 20, status } = {}) => {
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
        Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Contact.countDocuments(filter),
    ]);

    return {
        contacts,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};

/**
 * Get a single contact message by ID.
 * @param {string} id - MongoDB document ID
 * @returns {Promise<Contact|null>}
 */
exports.getContactById = async (id) => {
    return await Contact.findById(id);
};

/**
 * Update the status of a contact message.
 * @param {string} id - MongoDB document ID
 * @param {string} status - New status value
 * @returns {Promise<Contact|null>}
 */
exports.updateContactStatus = async (id, status) => {
    return await Contact.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );
};

/**
 * Delete a contact message by ID.
 * @param {string} id - MongoDB document ID
 * @returns {Promise<Contact|null>}
 */
exports.deleteContact = async (id) => {
    return await Contact.findByIdAndDelete(id);
};

/**
 * Count submissions from a given IP in the last N minutes.
 * Used for basic rate-limit checks at the service layer.
 * @param {string} ip
 * @param {number} windowMinutes
 * @returns {Promise<number>}
 */
exports.countRecentByIp = async (ip, windowMinutes = 15) => {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    return await Contact.countDocuments({ ip, createdAt: { $gte: since } });
};
