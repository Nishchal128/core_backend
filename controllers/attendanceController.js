const prisma = require("../models/prismaClient");

exports.markAttendance = async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Attendance status is required." });
    }

    try {
        // Ensure the user is an employee
        if (req.user.role !== "employee") {
            return res.status(403).json({ error: "Only employees can mark attendance." });
        }

        // Check if attendance is already marked for today
        const today = new Date().toISOString().split("T")[0];

        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                userId: req.user.id,
                date: today,
            },
        });

        if (existingAttendance) {
            return res.status(400).json({ error: "Attendance already marked for today." });
        }

        // Create attendance record
        const attendance = await prisma.attendance.create({
            data: {
                userId: req.user.id,
                date: today,
                status,
            },
        });

        res.status(201).json({ message: "Attendance marked successfully.", attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error marking attendance." });
    }
};
