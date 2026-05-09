const User = require("../models/User");

// GET /api/doctors  — list all users with role 'doctor'
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" }).select("-password").sort({ name: 1 });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await User.findOne({ _id: req.params.id, role: "doctor" }).select("-password");
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
