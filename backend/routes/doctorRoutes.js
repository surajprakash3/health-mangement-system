const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getDoctors, getDoctorById } = require("../controllers/doctorController");

// Public (or at least logged-in) — anyone can view doctors to book
router.get("/", protect, getDoctors);
router.get("/:id", protect, getDoctorById);

module.exports = router;
