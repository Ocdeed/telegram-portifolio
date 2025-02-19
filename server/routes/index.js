const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const inquiryController = require("../controllers/inquiryController");

// Message routes
router.post("/messages", messageController.saveMessage);
router.get("/messages", messageController.getMessages);
router.delete("/messages", messageController.clearMessages);

// Inquiry routes
router.post("/inquiries", inquiryController.submitInquiry);
router.get("/inquiries/:id", inquiryController.getInquiry);

module.exports = router;
