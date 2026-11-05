require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Testware Task Manager API is running");
});

app.get("/health", async (req, res) => {
  try {
    await db.query("select 1");
    res.json({ status: "OK", database: "Connected" });
  } 
  catch (err) {
    res.status(500).json({ status: "Database disconnected" });
  }
});
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});