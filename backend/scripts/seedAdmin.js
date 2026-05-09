const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const User = require("../models/User");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const email = "surajprak101@gmail.com";
        const existing = await User.findOne({ email });

        if (existing) {
            // If exists but not admin, update role
            if (existing.role !== "admin") {
                existing.role = "admin";
                await existing.save();
                console.log("✅ Existing user upgraded to admin:", email);
            } else {
                console.log("✅ Admin already exists:", email);
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("suraj@123", salt);

            await User.create({
                name: "Suraj Admin",
                email,
                password: hashedPassword,
                role: "admin"
            });

            console.log("✅ Admin user created successfully!");
            console.log("   Email:    surajprak101@gmail.com");
            console.log("   Password: suraj@123");
            console.log("   Role:     admin");
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

seedAdmin();
