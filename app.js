require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const manageUserRoutes = require("./routes/manageUsersRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Leave Management Backend API");
});

app.use("/users", userRoutes);
app.use("/leaves", leaveRoutes);
app.use("/manage-users", manageUserRoutes)

module.exports = app;
