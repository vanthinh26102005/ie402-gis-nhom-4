import express from "express";
const router = express.Router();

// API users
router.get("/", (req, res) => {
  res.json({ message: "List of users" });
});

export default router;
