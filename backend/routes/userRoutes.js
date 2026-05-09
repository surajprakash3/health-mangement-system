const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
    getUsers,
    getMe,
    updateMe,
    getUserById,
    deleteUser
} = require("../controllers/userController");

// Profile routes — any logged in user
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

// Admin-only routes
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.get("/:id", protect, authorizeRoles("admin"), getUserById);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;