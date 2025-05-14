const prisma = require("../models/prismaClient");

// apply for leave
exports.applyLeave = async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const leave = await prisma.leave.create({
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: "PENDING",
                userId: req.user.id,
            },
        });

        res.status(201).json(leave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error applying for leave." });
    }
};

// fetch all leaves for the authenticated user
exports.fetchLeaves = async (req, res) => {
    try {
        const leaves = await prisma.leave.findMany({
            where: { userId: req.user.id },
        });

        res.status(200).json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching leaves." });
    }
};

// approve/reject leave
exports.updateLeaveStatus = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body; 

    if (!["APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use 'APPROVED' or 'REJECTED'." });
    }

    try {
        const leave = await prisma.leave.findUnique({ where: { id: parseInt(leaveId) } });

        if (!leave) {
            return res.status(404).json({ error: "Leave not found." });
        }

        if (req.user.role !== "manager" && req.user.role !== "admin") {
            return res.status(403).json({ error: "You are not authorized to approve or reject leaves." });
        }

        const updatedLeave = await prisma.leave.update({
            where: { id: parseInt(leaveId) },
            data: { status },
        });

        res.status(200).json(updatedLeave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating leave status." });
    }
};
