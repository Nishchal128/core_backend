require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const manageUserRoutes = require("./routes/manageUsersRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Employee Management API");
});

app.use("/users", userRoutes);
app.use("/leaves", leaveRoutes);
app.use("/manage-users", manageUserRoutes)
app.use("/attendance", attendanceRoutes)

module.exports = app;
