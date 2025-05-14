const prisma = require("../models/prismaClient");

exports.markAttendance = async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Attendance status is required." });
    }

    try {
        if (req.user.role !== "employee") {
            return res.status(403).json({ error: "Only employees can mark attendance." });
        }

        // checking if attendance is already marked for today
        const today = new Date();
        today.setHours(0, 0, 0, 0); /*ye isiliye kara h because: Jab hum yeh check karte hain ki "today" ka attendance already mark hua hai ya nahi, toh humein sirf date se matlab hota hai, time se nahi.
                                    For example, aap nahi chahenge ki 2025-05-14T15:45:30 aur 2025-05-14T08:15:00 alag-alag din samjhe jaayein. */
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                userId: req.user.id,
                date: today,
            },
        });

        if (existingAttendance) {
            return res.status(400).json({ error: "Attendance already marked for today." });
        }

        // creating attendance record
        const attendance = await prisma.attendance.create({
            data: {
                userId: req.user.id,
                date: new Date(),
                status,
            },
        });

        res.status(201).json({ message: "Attendance marked successfully.", attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error marking attendance." });
    }
};
