const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
    createAppointment,
    getAllAppointments,
    getMyAppointments,
    updateAppointmentStatus,
    deleteAppointment
} = require("../controllers/appointmentController");

// Patient — book appointment
router.post("/", protect, authorizeRoles("patient"), createAppointment);

// All logged-in users — get their own appointments
router.get("/my", protect, getMyAppointments);

// Admin — get all appointments
router.get("/", protect, authorizeRoles("admin"), getAllAppointments);

// Doctor or Admin — update status
router.put("/:id/status", protect, authorizeRoles("doctor", "admin"), updateAppointmentStatus);

// Patient or Admin — delete/cancel
router.delete("/:id", protect, deleteAppointment);

module.exports = router;
