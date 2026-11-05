const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [tasks] = await db.query(
      "select * from tasks order by id asc"
    );
    res.json(tasks);
  } 
  catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [tasks] = await db.query(
      "select * from tasks where id = ?",
      [req.params.id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }
    res.json(tasks[0]);
  } 
  catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = (req.body.title || "").trim();
    if (!title) {
      return res.status(400).json({
        error: "Title is required"
      });
    }

    const [result] = await db.query(
      "insert into tasks (title, done) values (?, false)",
      [title]
    );

    const [tasks] = await db.query(
      "select * from tasks where id = ?",
      [result.insertId]
    );
    res.status(201).json(tasks[0]);
  } 
  catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "update tasks set done = ? where id = ?",
      [Boolean(req.body.done), req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    const [tasks] = await db.query(
      "select * from tasks where id = ?",
      [req.params.id]
    );
    res.json(tasks[0]);
  } 
  catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "delete from tasks where id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }
    res.status(204).end();
  } 
  catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;