const prisma = require("../models/prismaClient");
const bcrypt = require("bcrypt");

// add a user (employee or manager) controller
exports.addUser = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: "Email, password, and role are required." });
    }

    if (role !== "employee" && role !== "manager") {
        return res.status(400).json({ error: "Invalid role. Only 'employee' or 'manager' are allowed to be added." });
    }

    try {
        const userRole = req.user.role;

        if (userRole === "admin" || (userRole === "manager" && role === "employee")) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                },
            });

            return res.status(201).json({ message: "User added successfully.", user });
        } else {
            return res.status(403).json({ error: "Forbidden. You do not have permission to perform this action." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while adding the user." });
    }
};

// delete a user controller
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const userRole = req.user.role;
        const userToDelete = await prisma.user.findUnique({ where: { id: parseInt(id, 10) } });

        if (!userToDelete) {
            return res.status(404).json({ error: "User not found." });
        }

        if (userRole === "admin") {
            await prisma.user.delete({ where: { id: parseInt(id, 10) } });
            return res.status(200).json({ message: "User deleted successfully." });
        }

        if (userRole === "manager" && userToDelete.role === "employee") {
            await prisma.user.delete({ where: { id: parseInt(id, 10) } });
            return res.status(200).json({ message: "User deleted successfully." });
        }

        return res.status(403).json({ error: "Forbidden. You do not have permission to delete this user." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the user." });
    }
};
