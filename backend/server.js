const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));

app.use(helmet());

app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});

app.use(limiter);

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});