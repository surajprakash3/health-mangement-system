const Appointment = require("../models/Appointment");

// POST /api/appointments  — patient books appointment
exports.createAppointment = async (req, res) => {
    try {
        const { doctorId, date, notes } = req.body;

        if (!doctorId || !date) {
            return res.status(400).json({ message: "Doctor and date are required" });
        }

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            date: new Date(date),
            notes: notes || "",
        });

        const populated = await Appointment.findById(appointment._id)
            .populate("patient", "name email")
            .populate("doctor", "name email");

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/appointments  — admin: all; doctor/patient: redirect to /my
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient", "name email")
            .populate("doctor", "name email")
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/appointments/my  — get appointments for the logged-in user (patient or doctor)
exports.getMyAppointments = async (req, res) => {
    try {
        const query =
            req.user.role === "doctor"
                ? { doctor: req.user._id }
                : { patient: req.user._id };

        const appointments = await Appointment.find(query)
            .populate("patient", "name email")
            .populate("doctor", "name email")
            .sort({ date: -1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/appointments/:id/status  — doctor or admin updates status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        // Only admin or the assigned doctor can update
        if (
            req.user.role !== "admin" &&
            appointment.doctor.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        appointment.status = status;
        await appointment.save();

        const populated = await Appointment.findById(appointment._id)
            .populate("patient", "name email")
            .populate("doctor", "name email");

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/appointments/:id  — admin or patient (their own) can cancel/delete
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        if (
            req.user.role !== "admin" &&
            appointment.patient.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await appointment.deleteOne();
        res.json({ message: "Appointment deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
